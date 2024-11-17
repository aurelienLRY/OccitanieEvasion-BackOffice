// next-auth.d.ts
import "next-auth";

import { IUser } from "@/types";

declare module "next-auth" {
  interface User extends IUser {
    password?: string;
  }

  interface Session {
    user: User;
  }
}
