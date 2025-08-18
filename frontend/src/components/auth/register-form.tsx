"use client";

import type React from "react";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth/auth-store";
import { toast } from "sonner";
import type { RegisterForm as RegisterFormType } from "@/types/register/registerForm";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";
import { AxiosError } from "axios";

export function RegisterForm() {
  const router = useRouter();
  const { setToken } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register : registerAuth } = useAuth();
  const { isPending: isLoading, mutateAsync } = registerAuth;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormType>();

  const onSubmit = async (data: RegisterFormType) => {
    await mutateAsync(
      data,
      {
        onSuccess: (data) => {
          toast.success("¡Bienvenido de vuelta!");
          setToken(data.accessToken);
          router.push("/dashboard");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
          toast.error(
            error.response?.data.message || "Ocurrio un error al registrarse"
          );
        },
      }
    );

    return;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <div className="">
              <Input
                {...register("name", {
                  required: {
                    value: true,
                    message: "El nombre es obligatorio",
                  },
                })}
                id="name"
                type="text"
                placeholder="Tu nombre"
                className={`border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
                onBlur={() => trigger("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="">
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className={`border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md p-2`}
                {...register("email", {
                  required: { value: true, message: "El email es obligatorio" },
                })}
                onBlur={() => trigger("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="">
              <div className="">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md p-2 pr-10`}
                    {...register("password", {
                      required: {
                        value: true,
                        message: "La contraseña es obligatoria",
                      },
                    })}
                    onBlur={() => trigger("password")}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    title="Ver contraseña"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <div className="">
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10"
                  {...register("confirmPassword", {
                    required: {
                      value: true,
                      message: "La confirmación de contraseña es obligatoria",
                    },
                    validate: (value) => {
                      if (value !== watch("password")) {
                        return "Las contraseñas no coinciden";
                      }
                    },
                  })}
                  onBlur={() => trigger("confirmPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  title="Ver contraseña"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
          <Button type="submit" className={`w-full ${isLoading ? "cursor-wait" : "cursor-pointer"}`} disabled={!isValid}>
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
