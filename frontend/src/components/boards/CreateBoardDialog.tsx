"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BoardCreateDTO } from "@/models/board/BoardCreateDTO";
import { useForm } from "react-hook-form";
import { useCreateBoard } from "@/hooks/api/boards/useCreateBoard";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";
import { AxiosError } from "axios";

export const CreateBoardDialog = ({}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync, isPending: loading } = useCreateBoard();

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<BoardCreateDTO>();

  const onSubmit = async (data: BoardCreateDTO): Promise<void> => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success("Tablero creado exitosamente");
        reset({ name: "" });
        setOpen(false);
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        toast.error(
          error.response?.data.message || "Error al crear el tablero"
        );
      },
    });
    return;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Nuevo tablero</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear tablero</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm">Nombre</label>
          <div className="">
            <Input
              className={`${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Proyecto X"
              {...register("name", { required: "El nombre es requerido" })}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                e.key === "Enter" && handleSubmit(onSubmit)()
              }
              onFocus={() => {
                trigger("name");
              }}
              autoFocus
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit(onSubmit)} disabled={!isValid}>
            {loading ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
