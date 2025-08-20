import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateColumn } from "@/hooks/api/column/useCreateColumn";
import { CreateColumnForm } from "@/types/board/column/createColumnForm";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddColumnCardProps {
  setIsAddingColumn: (isAdding: boolean) => void;
  idBoard: string;
}
export const AddColumnCard = ({
  setIsAddingColumn,
  idBoard,
}: AddColumnCardProps) => {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<CreateColumnForm>();

  const { mutateAsync: createColumn, isPending } = useCreateColumn();

  const handleAddColumn = async (data: CreateColumnForm) => {
    await createColumn(
      { data, idBoard },
      {
        onSuccess: () => {
          reset();
          setIsAddingColumn(false);
          toast.success("Columna creada");
        },
        onError: (error) => {
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Error al crear la columna");
          }
        },
      }
    );
  };
  return (
    <Card className="min-w-80 p-4">
      <div className="space-y-3">
        <Input
          placeholder="Título de la columna"
          {...register("name", {
            required: "El título es obligatorio",
            minLength: {
              value: 3,
              message: "El título debe tener al menos 3 caracteres",
            },
          })}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit(handleAddColumn);
            if (e.key === "Escape") {
            }
          }}
          onBlur={() => {
            trigger("name");
          }}
          autoFocus
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSubmit(handleAddColumn)}
            className={`cursor-pointer ${isPending ? "opacity-70" : ""}`}
            disabled={isPending || !isValid}
          >
            {isPending ? "Creando..." : "Crear columna"}
          </Button>
          <Button
            size="sm"
            className="cursor-pointer"
            variant="outline"
            onClick={() => {
              setIsAddingColumn(false);
              reset({ name: "" });
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  );
};
