import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "../components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DIA - AI Emotional Support Assistant",
  description: "Your AI emotional support companion with voice interaction",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-900 text-white`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
