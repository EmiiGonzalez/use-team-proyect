import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";
import { ColumnDTO } from "@/models/column/ColumnDTO";
import { createColumn } from "@/service/column/ColumnService";
import { ColumnMutationVariables } from "@/interfaces/api/columnMutationVariables";

/**
 * Custom hook para crear un tablero usando TanStack Query
 */
export function useCreateColumn() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ColumnDTO,
    AxiosError<ApiErrorResponse>,
    ColumnMutationVariables
  >({
    mutationFn: ({ data, idBoard }) => createColumn(data, idBoard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  return mutation;
}
