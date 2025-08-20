import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";
import { updateTask, updateTasksPositionInColumn, updateTasksPositionInDifferentColumns } from "@/service/task/TaskService";
import { UpdateTaskForm, UpdateTaskPositionInDiferentColumns, UpdateTasksPositionForm } from "@/types/board/task/updateTaskForm";
import { TaskDTO } from "@/models/task/taskDTO";

/**
 * Custom hook para actualizar una tarea usando TanStack Query
 */
export const useUpdateTask = () => {
  const mutation = useMutation<
    TaskDTO,
    AxiosError<ApiErrorResponse>,
    UpdateTaskForm
  >({
    mutationFn: (data) => updateTask(data),
    retry: false, 
  });

  return mutation;
};


/**
 * Custom hook para actualizar tareas dentro de la misma columna usando TanStack Query
 */
export const useUpdateTasksPositionInColumn = () => {
  const mutation = useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    UpdateTasksPositionForm
  >({
    mutationFn: (data) => updateTasksPositionInColumn(data),
    retry: false, 
  });

  return mutation;
};

/**
 * Custom hook para actualizar tareas dentro de la misma columna usando TanStack Query
 */
export const useUpdateTasksPositionInDifferentColumns = () => {
  const mutation = useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    UpdateTaskPositionInDiferentColumns
  >({
    mutationFn: (data) => updateTasksPositionInDifferentColumns(data),
    retry: false, 
  });

  return mutation;
};
