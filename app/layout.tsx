import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Toaster, toast } from "sonner";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alumni Connection - FPT University",
  description:
    "Connect, network, and grow with FPT University alumni community",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
