import { ColumnDTO } from "@/models/column/ColumnDTO";
import { TaskDTO } from "@/models/task/taskDTO";

export const useReorderTaskInOtherColumn = () => {

  const reorderTaskInOtherColumn = (
    activeTask: TaskDTO,
    overTask: TaskDTO,
    columns: ColumnDTO[]
  ) => {
    const oldColumn = columns.find((col) => col.id === activeTask.columnId);
    const newColumn = columns.find((col) => col.id === overTask.columnId);
    const oldIndex = oldColumn?.tasks.findIndex((task) => task.id === activeTask.id) ?? -1;
    const newIndex = newColumn?.tasks.findIndex((task) => task.id === overTask.id) ?? -1;
    if (!oldColumn || !newColumn || oldIndex < 0 || newIndex < 0) {
      return columns;
    }

    // Copias profundas para evitar mutar el estado original
    const updatedColumns = columns.map((col) => ({ ...col, tasks: [...col.tasks] }));
    const oldCol = updatedColumns.find((col) => col.id === oldColumn.id)!;
    const newCol = updatedColumns.find((col) => col.id === newColumn.id)!;

    // Captura las tareas a intercambiar
    const active = { ...oldCol.tasks[oldIndex] };
    const over = { ...newCol.tasks[newIndex] };

    // Elimina las tareas de sus columnas originales
    oldCol.tasks.splice(oldIndex, 1);
    newCol.tasks.splice(newIndex, 1);

    // Intercambia los indices y posiciones
    active.position = newIndex;
    over.position = oldIndex;
    active.columnId = newCol.id;
    over.columnId = oldCol.id;

    // Inserta la tarea en la columna contraria en el índice correspondiente
    newCol.tasks.splice(newIndex, 0, active);
    oldCol.tasks.splice(oldIndex, 0, over);

    // Reasigna las posiciones en ambas columnas y fuerza nuevas referencias
    oldCol.tasks = oldCol.tasks.map((task, idx) => ({ ...task, position: idx }));
    newCol.tasks = newCol.tasks.map((task, idx) => ({ ...task, position: idx }));


    return updatedColumns.map(col => ({ ...col, tasks: [...col.tasks] }));
  };

  const removeTaskAndAddInNewColumn = (task: TaskDTO, column: ColumnDTO, columns: ColumnDTO[]) => {
    if (task.columnId === column.id) {
      return columns;
    }
    const updatedColumns = columns.map((col) => {
      if (col.id === task.columnId) {
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== task.id),
        };
      }
      if (col.id === column.id) {
        return {
          ...col,
          tasks: [...col.tasks, { ...task, columnId: col.id }],
        };
      }
      return col;
    });
    return updatedColumns;
  };

  return { reorderTaskInOtherColumn, removeTaskAndAddInNewColumn };
};
