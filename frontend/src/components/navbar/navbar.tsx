"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/auth-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Navbar = () => {
  const router = useRouter();
  const { clearToken: logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          KanbanApp
        </Link>
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="hover:underline text-gray-700 dark:text-gray-200"
          >
            Inicio
          </Link>
          <Link
            href="/boards"
            className="hover:underline text-gray-700 dark:text-gray-200"
          >
            Boards
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
      {/* Menú móvil */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t px-4 pb-4 flex flex-col gap-3 animate-fade-in">
          <Link href="/" className="py-2" onClick={() => setOpen(false)}>
            Inicio
          </Link>
          <Link href="/boards" className="py-2" onClick={() => setOpen(false)}>
            Boards
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      )}
    </nav>
  );
};
