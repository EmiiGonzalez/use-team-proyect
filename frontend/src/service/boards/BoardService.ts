import { BoardCreateDTO } from "@/models/board/BoardCreateDTO";
import { createHttpClient } from "../../../client/HttpClient";
import { BoardDTO } from "@/models/board/BoardDTO";

const client = createHttpClient("api/v1/boards");

// Obtener todos los tableros
export const getAllBoards = async (): Promise<BoardDTO[]> => {
  const response = await client.get<BoardDTO[]>("");
  return response.data;
};

// Crear un nuevo tablero
export const createBoard = async (board: BoardCreateDTO): Promise<BoardDTO> => {
  const response = await client.post<BoardDTO>("", board);
  return response.data;
};

export const getBoardById = async (id: string): Promise<BoardDTO> => {
  const response = await client.get<BoardDTO>(`/${id}`);
  return response.data;
};
