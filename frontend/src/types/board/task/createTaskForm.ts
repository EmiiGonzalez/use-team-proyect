import { TaskStatus } from "@/models/task/taskDTO";

export interface CreateTaskForm {
  name: string;
  description: string;
  status: TaskStatus;
}