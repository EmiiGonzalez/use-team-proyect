"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KanbanCard } from "../card/KanbanCard";
import { toast } from "sonner";
import { ColumnDTO } from "@/models/column/ColumnDTO";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteColumn } from "@/hooks/api/column/useDeleteColumn";
import { useColumnStore } from "@/store/boards/column/useColumnStore";
import { AddTask } from "../task/AddTask";

interface KanbanColumnProps {
  column: ColumnDTO;
}

export const KanbanColumn = ({ column }: KanbanColumnProps) => {
  const [isAddingCard, setIsAddingCard] = useState(false);

  const { mutateAsync: deleteColumn } = useDeleteColumn();

  const { setIsUpdatingColumn, setActiveColumn } = useColumnStore();

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      column
    }
  });

  const handleDeleteColumn = async () => {
    if (column.tasks.length > 0) {
      if (!confirm("¿Estás seguro? Esta columna tiene tareas.")) return;
    }
    deleteColumn(column.id, {
      onSuccess: () => {
        toast.success("Columna eliminada");
      },
      onError: () => {
        toast.error("Error al eliminar la columna");
      },
    });
  };

  return (
    <Card
      ref={setNodeRef}
      className={`min-w-80 max-w-80 transition-colors ${
        isOver ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {column.name}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteColumn}
              className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsUpdatingColumn(true);
                setActiveColumn(column);
              }}
              className="text-blue-500 hover:text-blue-700 p-2 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {column.tasks.length} tarea{column.tasks.length !== 1 ? "s" : ""}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <SortableContext
          items={column.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {isAddingCard ? (
          <AddTask columnId={column.id} setIsAddingCard={setIsAddingCard} />
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500"
            onClick={() => setIsAddingCard(true)}
          >
            + Agregar tarjeta
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
