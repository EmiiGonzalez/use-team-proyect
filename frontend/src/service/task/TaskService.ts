import { createHttpClient } from "../../../client/HttpClient";
import { ColumnDTO } from "@/models/column/ColumnDTO";
import { CreateTaskForm } from "@/types/board/task/createTaskForm";

const client = createHttpClient("api/v1/tasks");

// Crear una nueva tarea
export const createTask = async (
  task: CreateTaskForm,
  idColumn: string
): Promise<ColumnDTO> => {
  const response = await client.post<ColumnDTO>(`/${idColumn}`, task);
  return response.data;
};

// // Eliminar una columna
// export const deleteColumn = async (columnId: string) => {
//   const response = await client.delete(`/${columnId}`);
//   return response.data;
// };

// // Actualizar una columna
// export const updateColumn = async (columnData: UpdateColumnForm) => {
//   const response = await client.patch<ColumnDTO>(`/${columnData.id}`, columnData);
//   return response.data;
// };
