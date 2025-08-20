"use client";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";
import { AxiosError } from "axios";
import { useUpdateTaskComplete } from "@/hooks/api/task/useUpdateTask";
import { Edit3, FileText, ListTodo, Loader } from "lucide-react";
import { TaskDTO, TaskStatus } from "@/models/task/taskDTO";
import { UpdateTaskForm } from "@/types/board/task/updateTaskForm";
import { statusOptions } from "@/components/utils/StatusTaskOptionConfig";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateTaskDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  task: TaskDTO;
  setTask: (task: TaskDTO | null) => void;
  columnId: string;
  idBoard: string;
}

export const UpdateTaskDialog = ({
  open,
  setOpen,
  task,
  setTask,
  columnId,
  idBoard
}: UpdateTaskDialogProps) => {
  const { mutateAsync, isPending: loading } = useUpdateTaskComplete();
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<UpdateTaskForm>({
    defaultValues: {
      name: task.name || "",
      description: task.description || "",
      status: task.status || TaskStatus.TODO,
      columnId: columnId || "",
      id: task.id || "",
    },
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({
      name: task.name || "",
      description: task.description || "",
      status: task.status || TaskStatus.TODO,
      columnId: columnId || "",
      id: task.id || "",
    });
  }, [task, reset, columnId]);

  const onSubmit = async (data: UpdateTaskForm): Promise<void> => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success("Tarea actualizada exitosamente");
        queryClient.invalidateQueries({ queryKey: ["columns", idBoard] });
        setOpen(false);
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        toast.error(
          error.response?.data.message || "Error al actualizar la tarea"
        );
      },
    });
    setOpen(false);
    setTask(null);
    return;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Actualizar tarea
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Nombre
            </label>
            <Input
              className={`${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Implementar nueva funcionalidad"
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
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Descripción (opcional)
            </label>
            <Textarea
              className={`${
                errors.description ? "border-red-500" : "border-gray-300"
              } resize-none`}
              placeholder="Describe los detalles de la tarea..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              Estado
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={`${
                      errors.status ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || loading}
            className="cursor-pointer"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Actualizar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
