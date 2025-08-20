import { ColumnDTO } from "@/models/column/ColumnDTO";
import { TaskDTO } from "@/models/task/taskDTO";
import { arrayMove } from "@dnd-kit/sortable";
import { useUpdateTasksPositionInColumn } from "../api/task/useUpdateTask";
import { toast } from "sonner";

export const useReorderTask = () => {
  const {mutateAsync : update} = useUpdateTasksPositionInColumn();
  const reorderTask = async (
    activeTask: TaskDTO,
    overTask: TaskDTO,
    columns: ColumnDTO[]
  ) => {
    const originalColumns = {...columns};
    const column = columns.find((col) => col.id === activeTask.columnId);
    const oldIndex =
      column?.tasks.findIndex((task) => task.id === activeTask.id) ?? -1;
    const newIndex =
      column?.tasks.findIndex((task) => task.id === overTask.id) ?? -1;
    if (!column || oldIndex < 0 || newIndex < 0) {
      return columns;
    }
    const taskAffected = column.tasks[newIndex];

    // reasigno el order segun backend
    const auxOrder = activeTask.position;
    activeTask.position = taskAffected.position;
    taskAffected.position = auxOrder;

    column.tasks = arrayMove(column.tasks, oldIndex, newIndex);

    //envio los cambios al backend si ubo cambios

    if (activeTask.position !== taskAffected.position) {
      await update({
        columnId: column.id,
        tasks: [
          {
            taskId: activeTask.id,
            position: activeTask.position,
          },
          {
            taskId: taskAffected.id,
            position: taskAffected.position,
          },
        ],
      },
      {
        onError: (error) => {
          toast.error(error.response?.data.message || "Error al actualizar la posición de las tareas");
          return originalColumns; // Retorno las columnas originales en caso de error
        },
      }
    )
    }

    return columns;
  };

  return { reorderTask };
};
