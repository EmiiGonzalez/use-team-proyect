import { useQuery } from "@tanstack/react-query";
import { getAllBoards, getBoardById } from "@/service/boards/BoardService";
import { BoardDTO } from "@/models/board/BoardDTO";

/**
 * Custom hook para obtener todos los tableros usando TanStack Query
 */
export const useAllBoardsQuery = () => {
  return useQuery<BoardDTO[]>({
    queryKey: ["boards"],
    queryFn: getAllBoards,
  });
}

export const useGetBoard = (id: string) => {
  return useQuery<BoardDTO>({
    queryKey: ["board", id],
    queryFn: () => getBoardById(id),
  });
};