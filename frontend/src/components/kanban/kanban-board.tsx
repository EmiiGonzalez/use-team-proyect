"use client";

import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { Button } from "@/components/ui/button";
import { useKanbanStore } from "@/store/kanban-store";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useGetBoard } from "@/hooks/api/boards/useBoards";
import { useAllColumnQuery } from "@/hooks/api/column/useColumn";
import { TaskDTO } from "@/models/task/taskDTO";
import { AddColumnCard } from "./card/AddColumnCard";


export function KanbanBoard() {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskDTO | null>(null);
  const { id } = useParams<{ id: string }>();
  const { addColumn, moveCard } = useKanbanStore();

  const { data: board } = useGetBoard(id);
  const { data: columns } = useAllColumnQuery(id);
  const lastColumnPosition =
  columns && columns.length > 0
    ? Math.max(...columns.map(col => col.position))
    : 0;

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;

    // Encontrar la tarea que se está arrastrando
    const task = columns
      ?.flatMap((col) => col.tasks)
      .find((task) => task.id === taskId);

    setActiveTask(task ? task : null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Si se suelta sobre una columna
    if (overId.startsWith("column-")) {
      const targetColumnId = overId.replace("column-", "");
      await moveCard(taskId, targetColumnId);
      toast.success("Tarea movida");
    }
    // Si se suelta sobre otra tarea, mover a esa columna
    else {
      const targetTask = columns
        ?.flatMap((col) => col.tasks)
        .find((task) => task.id === overId);

      if (targetTask && targetTask.columnId !== activeTask?.columnId) {
        await moveCard(taskId, targetTask.columnId);
        toast.success("Tarea movida");
      }
    }
  };



  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {board?.name}
        </h2>
        <Button onClick={() => setIsAddingColumn(true)}>
          + Agregar Columna
        </Button>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns && (
            <SortableContext
              items={columns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column) => (
                <KanbanColumn key={column.id} column={column} />
              ))}
            </SortableContext>
          )}

          {isAddingColumn && (
            <AddColumnCard setIsAddingColumn={setIsAddingColumn} idBoard={id} lastColumnPosition={lastColumnPosition} />
          )}
        </div>

        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
