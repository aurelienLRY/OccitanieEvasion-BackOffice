import { NextResponse } from "next/server";
import { User } from "@/libs/database/models/User.model";
import { userSchema } from "@/libs/yup/user.schema";
import { connectDB, disconnectDB } from "@/libs/database/mongodb";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/auth";

/**
 * Fonction pour gérer les erreurs
 * @param message - Le message d'erreur
 * @param status - Le statut de la réponse HTTP
 * @returns NextResponse - La réponse formatée pour le client
 */
function handleError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Fonction pour créer un utilisateur
 * @param req - La requête HTTP
 * @returns NextResponse - La réponse formatée pour le client
 */
export async function POST(req: Request) {
  try {
    if (!process.env.NEXT_API_TOKEN) {
      return handleError("Service unavailable", 503);
    }

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return handleError("Token is required", 400);
    }
    if (token !== process.env.NEXT_API_TOKEN) {
      return handleError("Invalid token", 401);
    }

    const body = await req.json();
    if (!body) {
      return handleError("Request body is required", 400);
    }

    const { email, password, username, lastName } = body;
    if (!email || !password || !username || !lastName) {
      return handleError("All fields are required", 400);
    }

    await userSchema.validate({ email, password, username, lastName });

    await connectDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email: email,
      password: hashedPassword,
      username: username,
      lastName: lastName,
    });
    await user.save();

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return handleError(error.message, 400);
    }
    return handleError("Internal Server Error", 500);
  } finally {
    await disconnectDB();
  }
}

/**
 * Fonction pour mettre à jour le mot de passe
 * @param req - La requête HTTP
 * @returns NextResponse - La réponse formatée pour le client
 */
export const PUT = async (req: Request): Promise<NextResponse> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return createResponse(401, "Unauthorized", [
        "Vous devez être connecté pour modifier votre mot de passe",
      ]);
    }

    const data = await req.json();
    console.log("data >>", data);

    const { password, confirmPassword } = data;
    if (!password || !confirmPassword) {
      return createResponse(400, "Bad Request", [
        "Tous les champs sont requis",
      ]);
    }

    if (password !== confirmPassword) {
      return createResponse(400, "Bad Request", [
        "Les mots de passe ne correspondent pas",
      ]);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user._id,
      {
        password: hashedPassword,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      console.log("user >>", user);
      return createResponse(500, "Internal Server Error", [
        "Une erreur est survenue lors de la modification du mot de passe",
      ]);
    }

    return createResponse(
      200,
      null,
      ["Mot de passe modifié avec succès"],
      true
    );
  } catch (error) {
    console.log("error catch >>", error);
    return createResponse(500, "Internal Server Error", [
      "Une erreur est survenue lors de la modification du mot de passe",
    ]);
  } finally {
    await disconnectDB();
  }
};

/**
 * Fonction pour créer une réponse
 * @param status - Le statut de la réponse HTTP
 * @param error - Le message d'erreur, s'il y en a un
 * @param feedback - Le message de retour à l'utilisateur
 * @param success - Indique si l'opération a réussi (par défaut : false)
 * @returns NextResponse - La réponse formatée pour le client
 */
function createResponse(
  status: number,
  error: string | null,
  feedback: string[],
  success: boolean = false
): NextResponse {
  return NextResponse.json(
    {
      success,
      error,
      feedback,
      data: null,
    },
    { status }
  );
}
