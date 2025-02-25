import type { Metadata } from "next";
import { Inter, Architects_Daughter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const handwriting = Architects_Daughter({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-handwriting"
});

export const metadata: Metadata = {
  title: "Dream",
  description: "Dream finance application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${handwriting.variable} antialiased max-w-5xl mx-auto`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
