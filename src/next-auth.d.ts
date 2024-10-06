// next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    email: string;
    image: string | null;
  }

  interface Session {
    user: User;
  }
}