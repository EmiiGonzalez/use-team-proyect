import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";
import { ColumnDTO } from "@/models/column/ColumnDTO";
import { updateColumn } from "@/service/column/ColumnService";
import { UpdateColumnForm } from "@/types/board/column/updateColumnForm";

/**
 * Custom hook para crear un tablero usando TanStack Query
 */
export const useUpdateColumn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ColumnDTO,
    AxiosError<ApiErrorResponse>,
    UpdateColumnForm
  >({
    mutationFn: (data) => updateColumn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  return mutation;
}
