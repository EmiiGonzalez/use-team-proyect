import { LoginForm } from "@/components/auth/LoginForm"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Inicia sesión en tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Regístrate aquí
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
