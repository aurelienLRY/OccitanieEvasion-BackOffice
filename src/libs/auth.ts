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
        const userFound = await User.findOne({
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
      // On ajoute les informations de l'utilisateur au token
      if (user) {
        token.id = user._id as string;
        token.email = user.email as string;
        token.username = user.username as string;
        token.avatar = user.avatar as string;
        token.calendar = user.calendar as boolean;
        token.tokenCalendar = user.tokenCalendar as string;
        token.firstName = user.firstName as string;
        token.lastName = user.lastName as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // On ajoute les informations du token à la session utilisateur
        session.user = {
          id: token.id as string,
          _id: token.id as string,
          email: token.email as string,
          phone: token.phone as string,
          username: token.username as string,
          avatar: token.avatar as string,
          calendar: token.calendar as boolean,
          tokenCalendar: token.tokenCalendar as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
