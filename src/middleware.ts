export { default } from "next-auth/middleware";

// Configurer le middleware pour restreindre l'accès aux pages spécifiques
export const config = {
  matcher: [
    "/dashboard/:path*", // Protéger toutes les pages sous /dashboard
  ],
};
