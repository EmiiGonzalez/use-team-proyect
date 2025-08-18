"use client"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth/auth-store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function DashboardHeader() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    toast.success("Sesión cerrada")
    router.push("/")
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tablero Kanban</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Bienvenido, {user?.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  )
}
