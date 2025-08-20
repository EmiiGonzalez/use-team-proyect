import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateTaskForm } from "@/types/board/task/createTaskForm";
import { TaskStatus } from "@/models/task/taskDTO";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateTask } from "@/hooks/api/task/useTaskColumn";
import { toast } from "sonner";

interface AddTaskProps {
  setIsAddingCard: (isAdding: boolean) => void;
  columnId: string;
}

export const AddTask = ({ setIsAddingCard, columnId }: AddTaskProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<CreateTaskForm>({
    defaultValues: {
      name: "",
      description: "",
      status: TaskStatus.TODO,
    },
  });

  const { mutate: createTask, isPending } = useCreateTask();

  const handleAddCard = (data: CreateTaskForm) => {
    createTask(
      { data, idColumn: columnId },
      {
        onSuccess: () => {
          reset();
          setIsAddingCard(false);
          toast.success("Tarea creada con éxito");
        },
        onError: (error) => {
          toast.error(
            error.response?.data.message || "Error al crear la tarea"
          );
        },
      }
    );
  };

  const handleCancel = () => {
    setIsAddingCard(false);
    reset();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="space-y-2">
        <label className="text-sm font-medium">Título de la tarjeta</label>
        <Input
          placeholder="Ingresa el título de la tarjeta"
          {...register("name", {
            required: { value: true, message: "El nombre es requerido" },
            minLength: {
              value: 3,
              message: "El nombre debe tener al menos 3 caracteres",
            },
          })}
          onKeyDown={onKeyDown}
          autoFocus
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descripción</label>
        <Textarea
          className="resize-none"
          placeholder="Describe la tarea"
          {...register("description")}
          rows={3}
          onKeyDown={onKeyDown}
        />
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Estado</label>
        <Controller
          name="status"
          control={control}
          rules={{ required: "El estado es requerido" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskStatus.TODO}>Por hacer</SelectItem>
                <SelectItem value={TaskStatus.IN_PROGRESS}>
                  En progreso
                </SelectItem>
                <SelectItem value={TaskStatus.DONE}>Completado</SelectItem>
                <SelectItem value={TaskStatus.BLOCKED}>Bloqueado</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && (
          <span className="text-red-500 text-sm">{errors.status.message}</span>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          onClick={handleSubmit(handleAddCard)}
          disabled={!isValid || isPending}
          className="flex-1 cursor-pointer"
        >
          {isPending ? "Agregando..." : "Agregar Tarjeta"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          className="flex-1 cursor-pointer"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};
