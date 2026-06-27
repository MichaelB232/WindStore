import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import { AuthProvider } from "../services/auth/providers/AuthProviders";
import { WishlistProvider } from "@/src/services/wishlist/context/WishlistContext";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WindStore",
  description:
    "Browse gaming, professional, AI-powered, and creator laptops from the world's leading Windows brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolageGrotesque.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <WishlistProvider>{children}</WishlistProvider>
          <Toaster/>
        </AuthProvider>
      </body>
    </html>
  );
}
