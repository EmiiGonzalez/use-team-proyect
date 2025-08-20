import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";
import { deleteTask } from "@/service/task/TaskService";

/**
 * Custom hook para eliminar una tarea usando TanStack Query
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    { columnId: string; taskId: string }
  >({
    mutationFn: ({ columnId, taskId }) => deleteTask(columnId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
    },
  });

  return mutation;
};
