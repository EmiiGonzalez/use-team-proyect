import { ColumnDTO } from "@/models/column/ColumnDTO";
import { TaskDTO } from "@/models/task/taskDTO";
import {
  useUpdateTask,
  useUpdateTasksPositionInDifferentColumns,
} from "../api/task/useUpdateTask";
import { toast } from "sonner";

export const useReorderTaskInOtherColumn = () => {
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: updateTasksPositionInDifferentColumns } =
    useUpdateTasksPositionInDifferentColumns();

  const reorderTaskInOtherColumn = async (
    activeTask: TaskDTO,
    overTask: TaskDTO,
    columns: ColumnDTO[]
  ) => {
    const oldColumn = columns.find((col) => col.id === activeTask.columnId);
    const newColumn = columns.find((col) => col.id === overTask.columnId);
    const oldIndex =
      oldColumn?.tasks.findIndex((task) => task.id === activeTask.id) ?? -1;
    const newIndex =
      newColumn?.tasks.findIndex((task) => task.id === overTask.id) ?? -1;
    if (!oldColumn || !newColumn || oldIndex < 0 || newIndex < 0) {
      return columns;
    }

    // Copias profundas para evitar mutar el estado original
    const updatedColumns = columns.map((col) => ({
      ...col,
      tasks: [...col.tasks],
    }));
    const oldCol = updatedColumns.find((col) => col.id === oldColumn.id)!;
    const newCol = updatedColumns.find((col) => col.id === newColumn.id)!;

    // Captura las tareas a intercambiar
    const active = { ...oldCol.tasks[oldIndex] };
    const over = { ...newCol.tasks[newIndex] };

    // Elimina las tareas de sus columnas originales
    oldCol.tasks.splice(oldIndex, 1);
    newCol.tasks.splice(newIndex, 1);

    // Intercambia los indices y posiciones
    active.position = overTask.position;
    over.position = activeTask.position;
    active.columnId = newCol.id;
    over.columnId = oldCol.id;

    // Inserta la tarea en la columna contraria en el índice correspondiente
    newCol.tasks.splice(newIndex, 0, active);
    oldCol.tasks.splice(oldIndex, 0, over);

    //enviar put con el cambio de column al backend
    console.log("updateando cambios", active, over);

    let updateColumns: ColumnDTO[] = [];

    //chequeo que haya cambios
    if (
      active.columnId !== over.columnId ||
      active.position !== over.position
    ) {
      await updateTasksPositionInDifferentColumns(
        {
          taskA: {
            columnId: active.columnId,
            position: active.position,
            taskId: active.id,
          },
          taskB: {
            columnId: over.columnId,
            position: over.position,
            taskId: over.id,
          },
        },
        {
          onError: (error) => {
            toast.error(
              error.response?.data.message || "Error al actualizar la tarea"
            );
            updateColumns = columns;
          },
          onSettled: () => {
            updateColumns = updatedColumns.map((col) => ({
              ...col,
              tasks: [...col.tasks],
            }));
          },
        }
      );
    }

    return updateColumns;
  };

  const removeTaskAndAddInNewColumn = async (
    task: TaskDTO,
    column: ColumnDTO,
    columns: ColumnDTO[]
  ) => {
    if (task.columnId === column.id) {
      return columns;
    }
    let taskUpdated: TaskDTO = undefined!;
    let updatedColumns = columns.map((col) => {
      if (col.id === task.columnId) {
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== task.id),
        };
      }
      if (col.id === column.id) {
        const updatedTask: TaskDTO = { ...task, columnId: col.id };
        taskUpdated = updatedTask;
        return {
          ...col,
          tasks: [...col.tasks, updatedTask],
        };
      }
      return col;
    });
    //enviar put con el cambio de column al backend
    if (taskUpdated != undefined) {
      const lastOrderInColumn = Math.max(
        ...column.tasks.map((t) => t.position),
        0
      );
      await updateTask(
        {
          columnId: taskUpdated.columnId,
          position: lastOrderInColumn + 1,
          description: taskUpdated.description
            ? taskUpdated.description
            : undefined,
          name: taskUpdated.name,
          id: taskUpdated.id,
          status: taskUpdated.status,
        },
        {
          onError: (error) => {
            toast.error(
              error.response?.data.message || "Error al actualizar la tarea"
            );
            updatedColumns = columns;
          },
        }
      );
    }
    return updatedColumns;
  };

  return { reorderTaskInOtherColumn, removeTaskAndAddInNewColumn };
};
