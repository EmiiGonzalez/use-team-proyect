import { CreateColumnForm } from "@/types/board/column/createColumnForm";
import { createHttpClient } from "../../../client/HttpClient";
import { ColumnDTO } from "@/models/column/ColumnDTO";
import { UpdateColumnForm } from "@/types/board/column/updateColumnForm";

const client = createHttpClient("api/v1/columns");

// Obtener todos los tableros
export const getAllColumns = async (idBoard: string): Promise<ColumnDTO[]> => {
  const response = await client.get<ColumnDTO[]>(`/all/${idBoard}`);
  return response.data;
};

// Crear una nueva columna
export const createColumn = async (
  column: CreateColumnForm,
  idBoard: string
): Promise<ColumnDTO> => {
  const response = await client.post<ColumnDTO>(`/${idBoard}`, column);
  return response.data;
};

// Eliminar una columna
export const deleteColumn = async (columnId: string) => {
  const response = await client.delete(`/${columnId}`);
  return response.data;
};

// Actualizar una columna
export const updateColumn = async (columnData: UpdateColumnForm) => {
  const response = await client.patch<ColumnDTO>(`/${columnData.id}`, columnData);
  return response.data;
};
