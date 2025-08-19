import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import ReactQueryProvider from "../src/components/ReactQueryProvider";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar/navbar";

export const metadata: Metadata = {
  title: "Tablero Kanban Colaborativo",
  description: "Gestiona tus proyectos con un tablero Kanban en tiempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ReactQueryProvider>
          <Navbar />
          <main className="px-4 py-4 bg-gray-50 dark:bg-gray-900 w-full">
            <div className="w-full">{children}</div>
          </main>
          <Toaster position="top-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
