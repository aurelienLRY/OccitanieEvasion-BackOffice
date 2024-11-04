import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider , theme} from "antd";


/*components */
import { Header } from "@/components/ui/Header";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Back Office | Gestion des utilisateurs",
  description: "Back Office | Gestion des utilisateurs",
};

/*
*root layout
*@returns {JSX.Element} 
*/
export default async function RootLayout({
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
            colorPrimary: "#ffffff"
          },
        }}>
        <Header />
        {children}
        </ConfigProvider>
      </body>
    </html>
  );
}