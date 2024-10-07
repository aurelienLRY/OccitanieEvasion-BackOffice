import { NextResponse } from "next/server";
import User from "@/libs/database/models/User";
import { userSchema } from "@/libs/yup/user.schema";
import { connectDB } from "@/libs/database/mongodb";
import bcrypt from "bcryptjs";

// Gestionnaire d'erreur amélioré
function handleError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  try {
    if (!process.env.NEXT_API_TOKEN) {
      return handleError("Service unavailable", 503);
    }

    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
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

    const { email, password, username, name } = body;
    if (!email || !password || !username || !name) {
      return handleError("All fields are required", 400);
    }

    await userSchema.validate({ email, password, username, name });

    await connectDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username, name });
    await user.save();

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return handleError(error.message, 400);
    }
    return handleError("Internal Server Error", 500);
  }
}
