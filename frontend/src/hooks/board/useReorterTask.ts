import { ColumnDTO } from "@/models/column/ColumnDTO";
import { TaskDTO } from "@/models/task/taskDTO";
import { arrayMove } from "@dnd-kit/sortable";

export const useReorderTask = () => {
  const reorderTask = (
    activeTask: TaskDTO,
    overTask: TaskDTO,
    columns: ColumnDTO[]
  ) => {
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
    return columns;
  };

  return { reorderTask };
};
