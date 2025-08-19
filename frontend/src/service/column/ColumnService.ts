import { CreateColumnForm } from "@/types/board/column/createColumnForm";
import { createHttpClient } from "../../../client/HttpClient";
import { ColumnDTO } from "@/models/column/ColumnDTO";

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
export const deleteColumn = async (columnId: string, idBoard: string) => {
  const response = await client.delete(`/${columnId}`, {
    data: { idBoard: idBoard },
  });
  return response.data;
};
