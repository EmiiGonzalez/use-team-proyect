"use client";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";
import { AxiosError } from "axios";
import { ColumnDTO } from "@/models/column/ColumnDTO";
import { UpdateColumnForm } from "@/types/board/column/updateColumnForm";
import { useUpdateColumn } from "@/hooks/api/column/useUpdateColumn";

interface UpdateColumnDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  column: ColumnDTO;
}
export const UpdateColumnDialog = ({
  open,
  setOpen,
  column,
}: UpdateColumnDialogProps) => {
  const { mutateAsync, isPending: loading } = useUpdateColumn();

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<UpdateColumnForm>({
    defaultValues: {
      name: column.name ? column.name : "",
      id: column.id ? column.id : "",
    },
  });

  useEffect(() => {
    reset({
      name: column.name ? column.name : "",
      id: column.id ? column.id : "",
    });
  }, [column, reset]);

  const onSubmit = async (data: UpdateColumnForm): Promise<void> => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success("Columna actualizada exitosamente");
        reset({ name: "", id: "" });
        setOpen(false);
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        toast.error(
          error.response?.data.message || "Error al actualizar la columna"
        );
      },
    });
    return;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar columna</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm">Nombre</label>
          <div className="">
            <Input
              className={`${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Tablero 1"
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
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
            className="cursor-pointer"
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
