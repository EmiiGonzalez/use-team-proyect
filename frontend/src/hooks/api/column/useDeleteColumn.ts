import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";
import { ColumnDTO } from "@/models/column/ColumnDTO";
import { deleteColumn } from "@/service/column/ColumnService";

/**
 * Custom hook para eliminar una columna usando TanStack Query
 */
export function useDeleteColumn() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ColumnDTO,
    AxiosError<ApiErrorResponse>,
    { idBoard: string; columnId: string }
  >({
    mutationFn: ({ columnId, idBoard }) => deleteColumn(columnId, idBoard),  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  return mutation;
}
