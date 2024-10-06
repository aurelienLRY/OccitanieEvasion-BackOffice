import { connectDB } from "@/libs/database/mongodb";
import User from "@/libs/database/models/User";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const userFound  = await User.findOne({
          email: credentials?.email,
        });

        if (!userFound) throw new Error("Email inconnu");

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password
        );

        if (!passwordMatch) throw new Error("Mot de passe incorrect");
        return userFound;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.username = user.username as string; // Ajoutez le nom d'utilisateur au jeton
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          username: token.username as string,
          image: token.image as string | null,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};