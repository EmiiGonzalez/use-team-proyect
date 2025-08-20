"use client";
import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./column/KanbanColumn";
import { KanbanCard } from "./card/KanbanCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useGetBoard } from "@/hooks/api/boards/useBoards";
import { useAllColumnQuery } from "@/hooks/api/column/useColumn";
import { TaskDTO } from "@/models/task/taskDTO";
import { AddColumnCard } from "./card/AddColumnCard";
import { UpdateColumnDialog } from "./dialog/UpdateColumnDialog";
import { useColumnStore } from "@/store/boards/column/useColumnStore";
import { useReorderTask } from "@/hooks/board/useReorterTask";
import { useReorderTaskInOtherColumn } from "@/hooks/board/useReorterTaskInOtherColumn";
import { ColumnDTO } from "@/models/column/ColumnDTO";
import { useSortColumns } from "@/hooks/board/useSortColumns";
export const KanbanBoard = () => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskDTO | null>(null);
  const { id } = useParams<{ id: string }>();

  const { isUpdatingColumn, setIsUpdatingColumn, activeColumn } =
    useColumnStore();
  const [columns, setColumns] = useState<ColumnDTO[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  const { data: board } = useGetBoard(id);
  const { data } = useAllColumnQuery(id);
  const { reorderTask } = useReorderTask();
  const { reorderTaskInOtherColumn, removeTaskAndAddInNewColumn } =
    useReorderTaskInOtherColumn();

  useSortColumns(data, setColumns);

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
    const activeTask = active.data.current?.task as TaskDTO;
    if (!over || !active) {
      setActiveTask(null);
      return;
    }
    const overId = over.id as string;

    if (overId.includes("column-")) {
      const overColumn = over.data.current?.column as ColumnDTO;
      if (!overColumn) {
        return;
      }
      setColumns(
        await removeTaskAndAddInNewColumn(activeTask, overColumn, columns)
      );
      //si ubo cambios notifico
      if (
        overColumn.tasks.length !==
        columns.find((col) => col.id === activeTask.columnId)?.tasks.length
      ) {
        toast.success("Tarea movida exitosamente a otra columna");
      }
      return;
    }

    const overTask = over.data.current?.task as TaskDTO;
    if (overTask.columnId == activeTask.columnId) {
      setColumns(await reorderTask(activeTask, overTask, columns));
      //corroboro que haya cambios
      if (
        overTask.position !==
        columns
          .find((col) => col.id === activeTask.columnId)
          ?.tasks.find((task) => task.id === activeTask.id)?.position
      ) {
        toast.success("Tarea movida exitosamente");
      }
    } else {
      setColumns(await reorderTaskInOtherColumn(activeTask, overTask, columns));
      toast.success("Tarea movida exitosamente a otra columna");
    }

    setActiveTask(null);
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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={rectIntersection}
      >
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 px-4">
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
            <AddColumnCard
              setIsAddingColumn={setIsAddingColumn}
              idBoard={id}
            />
          )}
        </div>

        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      {activeColumn && (
        <UpdateColumnDialog
          open={isUpdatingColumn}
          setOpen={setIsUpdatingColumn}
          column={activeColumn}
        />
      )}
    </div>
  );
};
