import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider , theme} from "antd";

/*components */
import Header from "@/components/Header";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Back Office | Gestion des utilisateurs",
  description: "Back Office | Gestion des utilisateurs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth dark">
      <body className={`${inter.className} w-screen dark:bg-gray-900 dark:text-white`}>
        <ConfigProvider
        theme={{
          token: {
   
          },
        }}>
        <Header />
        {children}
        </ConfigProvider>
      </body>
    </html>
  );
}