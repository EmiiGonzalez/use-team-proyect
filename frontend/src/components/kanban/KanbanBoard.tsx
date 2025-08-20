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
import { useBoardSocket } from "@/hooks/useBoardSocket";
import { useTaskStore } from "@/store/boards/task/useTaskStore";
import { UpdateTaskDialog } from "./dialog/UpdateTaskDialog";
import { LoadingState } from "./errors/LoadingState";
import { BoardErrorState } from "./errors/BoardErrorState";
import { ConnectionStatus } from "./errors/ConnectionStatus";
import { ColumnsErrorState } from "./errors/ColumnsErrorState";

export const KanbanBoard = () => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskDTO | null>(null);
  const [isRetryingBoard, setIsRetryingBoard] = useState(false);
  const [isRetryingColumns, setIsRetryingColumns] = useState(false);
  const { id } = useParams<{ id: string }>();

  const { isUpdatingColumn, setIsUpdatingColumn, activeColumn } =
    useColumnStore();
  const {
    isUpdatingTask,
    setIsUpdatingTask,
    activeTask: task,
    setActiveTask: setTask,
  } = useTaskStore();
  const [columns, setColumns] = useState<ColumnDTO[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  const {
    data: board,
    error: boardError,
    isLoading: boardLoading,
    isError: boardIsError,
    refetch: refetchBoard,
  } = useGetBoard(id);

  const {
    data: columnsData,
    error: columnsError,
    isLoading: columnsLoading,
    refetch: refetchColumns,
  } = useAllColumnQuery(id);

  const { isConnected } = useBoardSocket({
    boardId: id,
  });
  const { reorderTask } = useReorderTask();
  const { reorderTaskInOtherColumn, removeTaskAndAddInNewColumn } =
    useReorderTaskInOtherColumn();

  useSortColumns(columnsData, setColumns);

  const handleRetryBoard = async () => {
    setIsRetryingBoard(true);
    try {
      await refetchBoard();
    } catch (error) {
      toast.error("No se pudo reconectar. Inténtalo de nuevo.");
    } finally {
      setIsRetryingBoard(false);
    }
  };

  const handleRetryColumns = async () => {
    setIsRetryingColumns(true);
    try {
      await refetchColumns();
      toast.success("Columnas recargadas exitosamente");
    } catch (error) {
      toast.error("Error al recargar columnas");
    } finally {
      setIsRetryingColumns(false);
    }
  };

  const getErrorType = (error: any) => {
    if (!error) return "general";

    const status = error.response?.status;
    if (status === 404) return "not_found";
    if (status === 401 || status === 403) return "unauthorized";
    if (!navigator.onLine || error.code === "NETWORK_ERROR") return "network";

    return "general";
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;

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

    try {
      const overId = over.id as string;

      if (overId.includes("column-")) {
        const overColumn = over.data.current?.column as ColumnDTO;
        if (!overColumn) return;

        setColumns(
          await removeTaskAndAddInNewColumn(activeTask, overColumn, columns)
        );

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

        if (
          overTask.position !==
          columns
            .find((col) => col.id === activeTask.columnId)
            ?.tasks.find((task) => task.id === activeTask.id)?.position
        ) {
          toast.success("Tarea movida exitosamente");
        }
      } else {
        setColumns(
          await reorderTaskInOtherColumn(activeTask, overTask, columns)
        );
        toast.success("Tarea movida exitosamente a otra columna");
      }
    } catch (error) {
      toast.error("Error al mover la tarea. Inténtalo de nuevo.");
      console.error("Error moving task:", error);
    } finally {
      setActiveTask(null);
    }
  };

  // Estado de carga inicial
  if (boardLoading) {
    return (
      <div className="h-full">
        <LoadingState message="Cargando tablero..." />
      </div>
    );
  }

  // Error en el board principal
  if (boardError) {
    return (
      <div className="h-full">
        <BoardErrorState
          onRetry={handleRetryBoard}
          isRetrying={isRetryingBoard}
          errorType={getErrorType(boardError)}
        />
        <ConnectionStatus
          isConnected={isConnected}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {board?.name}
        </h2>
        {!boardIsError && !boardLoading && (
          <Button
            onClick={() => setIsAddingColumn(true)}
          >
            + Agregar Columna
          </Button>
        )}
      </div>

      {/* Error específico de columnas */}
      {columnsError && (
        <ColumnsErrorState
          onRetry={handleRetryColumns}
          isRetrying={isRetryingColumns}
        />
      )}

      {/* Loading de columnas */}
      {columnsLoading && !columnsError && (
        <div className="mx-4">
          <LoadingState message="Cargando columnas..." />
        </div>
      )}

      {/* Contenido principal - solo si no hay errores críticos */}
      {!columnsError && !columnsLoading && (
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
      )}

      {/* Diálogos */}
      {activeColumn && (
        <UpdateColumnDialog
          open={isUpdatingColumn}
          setOpen={setIsUpdatingColumn}
          column={activeColumn}
        />
      )}

      {task && (
        <UpdateTaskDialog
          open={isUpdatingTask}
          setOpen={setIsUpdatingTask}
          task={task}
          setTask={setTask}
          columnId={task.columnId}
        />
      )}
    </div>
  );
};
