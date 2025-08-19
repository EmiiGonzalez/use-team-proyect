"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth/auth-store";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const { setToken } = useAuthStore();
  const { isPending: loginIsLoading, mutateAsync } = login;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await mutateAsync(
      { email, password },
      {
        onSuccess: (data) => {
          toast.success("¡Bienvenido de vuelta!");
          setToken(data.accessToken);
          router.push("/boards");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
          toast.error(
            error.response?.data.message || "Error al iniciar sesión"
          );
        },
      }
    );

    return;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loginIsLoading}>
            {loginIsLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
