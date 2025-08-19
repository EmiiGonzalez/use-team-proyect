import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoard } from "@/service/boards/BoardService";
import { BoardCreateDTO } from "@/models/board/BoardCreateDTO";
import { BoardDTO } from "@/models/board/BoardDTO";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";

/**
 * Custom hook para crear un tablero usando TanStack Query
 */
export function useCreateBoard() {
  const queryClient = useQueryClient();
  const mutation = useMutation<BoardDTO, AxiosError<ApiErrorResponse>, BoardCreateDTO>({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  return mutation;
}
