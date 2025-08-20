import { CreateTaskForm } from "@/types/board/task/createTaskForm";

export interface TaskMutationVariables {
  data: CreateTaskForm;
  idColumn: string;
}
