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
    active.position = overTask.position;
    over.position = activeTask.position;
    active.columnId = newCol.id;
    over.columnId = oldCol.id;

    // Inserta la tarea en la columna contraria en el índice correspondiente
    newCol.tasks.splice(newIndex, 0, active);
    oldCol.tasks.splice(oldIndex, 0, over);

    //enviar put con el cambio de column al backend
    console.log("updateando cambios", active, over);

    return updatedColumns.map(col => ({ ...col, tasks: [...col.tasks] }));
  };

  const removeTaskAndAddInNewColumn = (task: TaskDTO, column: ColumnDTO, columns: ColumnDTO[]) => {
    if (task.columnId === column.id) {
      return columns;
    }
    let taskUpdated: TaskDTO | null = null;
    const updatedColumns = columns.map((col) => {
      if (col.id === task.columnId) {
      return {
        ...col,
        tasks: col.tasks.filter((t) => t.id !== task.id),
      };
      }
      if (col.id === column.id) {
      const updatedTask = { ...task, columnId: col.id };
      taskUpdated = updatedTask;
      return {
        ...col,
        tasks: [...col.tasks, updatedTask],
      };
      }
      return col;
    });
    //enviar put con el cambio de column al backend
    if (taskUpdated) {
      console.log("updateando cambios", taskUpdated)
    }
    return updatedColumns;
  };

  return { reorderTaskInOtherColumn, removeTaskAndAddInNewColumn };
};
