import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";
import { ColumnDTO } from "@/models/column/ColumnDTO";
import { TaskMutationVariables } from "@/interfaces/api/taskMutationVariables copy";
import { createTask } from "@/service/task/TaskService";

/**
 * Custom hook para crear una tarea usando TanStack Query
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    ColumnDTO,
    AxiosError<ApiErrorResponse>,
    TaskMutationVariables
  >({
    mutationFn: ({ data, idColumn }) => createTask(data, idColumn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  return mutation;
}
