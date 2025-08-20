import { createHttpClient } from "../../../client/HttpClient";
import { ColumnDTO } from "@/models/column/ColumnDTO";
import { TaskDTO } from "@/models/task/taskDTO";
import { CreateTaskForm } from "@/types/board/task/createTaskForm";
import {
  UpdateTaskForm,
  UpdateTaskPositionInDiferentColumns,
  UpdateTasksPositionForm,
} from "@/types/board/task/updateTaskForm";

const client = createHttpClient("api/v1/tasks");
const clientColumns = createHttpClient("api/v1/reorder/tasks/columns");

// Crear una nueva tarea
export const createTask = async (
  task: CreateTaskForm,
  idColumn: string
): Promise<ColumnDTO> => {
  const response = await client.post<ColumnDTO>(`/${idColumn}`, task);
  return response.data;
};

// // Eliminar una task
export const deleteTask = async (columnId: string, taskId: string) => {
  const response = await client.delete(`/${columnId}`, {
    data: {
      id: taskId,
    },
  });
  return response.data;
};

// Actualizar una tarea
export const updateTask = async (taskData: UpdateTaskForm) => {
  const response = await client.patch<TaskDTO>(
    `/${taskData.columnId}`,
    taskData
  );
  return response.data;
};

// Actualizar una tarea
export const updateTaskComplete = async (taskData: UpdateTaskForm) => {
  const response = await client.patch<TaskDTO>(
    `update/${taskData.columnId}`,
    taskData
  );
  return response.data;
};

// Actualizar tareas dentro de la misma columna
export const updateTasksPositionInColumn = async (
  taskData: UpdateTasksPositionForm
) => {
  const response = await client.patch(
    `/update/tasks/${taskData.columnId}`,
    taskData
  );
  return response.data;
};

// Actualizar tareas en diferentes columnas
export const updateTasksPositionInDifferentColumns = async (
  taskData: UpdateTaskPositionInDiferentColumns
) => {
  const response = await clientColumns.patch(``, taskData);
  return response.data;
};
