import { connectDB } from "@/libs/database/mongodb";
import User from "@/libs/database/models/User";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
/*types*/
import type { IUser } from "@/types";
import { crypto } from "@/utils";

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
        console.log("userFound", userFound);

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
    async jwt({ token, user, trigger, session }) {
      // On ajoute les informations de l'utilisateur au token
      if (user) {
        token.id = user._id as string;
        token.email = user.email as string;
        token.phone = user.phone as string;
        token.username = user.username as string;
        token.avatar = user.avatar as string;
        token.calendar = user.calendar as boolean;
        token.tokenCalendar = user.tokenCalendar as string;
        token.firstName = user.firstName as string;
        token.lastName = user.lastName as string;
      }
      if (trigger === "update" && session) {
        if (session.user.avatar) {
          token.avatar = session.user.avatar as string;
        }
        if (session.user.username) {
          token.username = session.user.username as string;
        }
        if (session.user.firstName) {
          token.firstName = session.user.firstName as string;
        }
        if (session.user.lastName) {
          token.lastName = session.user.lastName as string;
        }
        if (session.user.phone) {
          token.phone = session.user.phone as string;
        }
        if (session.user.calendar) {
          token.calendar = session.user.calendar as boolean;
        }
        if (session.user.tokenCalendar) {
          token.tokenCalendar = session.user.tokenCalendar as string;
        }
        if (session.user.firstName) {
          token.firstName = session.user.firstName as string;
        }
        if (session.user.lastName) {
          token.lastName = session.user.lastName as string;
        }
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
