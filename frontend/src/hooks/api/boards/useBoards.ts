import { useQuery } from "@tanstack/react-query";
import { getAllBoards } from "@/service/boards/BoardService";
import { BoardDTO } from "@/models/board/BoardDTO";

/**
 * Custom hook para obtener todos los tableros usando TanStack Query
 */
export function useBoards() {
  return useQuery<BoardDTO[]>({
    queryKey: ["boards"],
    queryFn: getAllBoards,
  });
}
