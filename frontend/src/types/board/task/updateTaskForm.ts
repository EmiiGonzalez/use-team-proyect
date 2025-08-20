import { TaskStatus } from "@/models/task/taskDTO";

export interface UpdateTaskForm {
  id: string;
  columnId: string;
  name: string;
  description?: string;
  status?: TaskStatus;
  position: number;
}

export interface UpdateTasksPositionForm {
  columnId: string;
  tasks: {
    taskId: string;
    position: number;
  }[];
}

interface Task {
  taskId: string;
  position: number;
  columnId: string;
}

export interface UpdateTaskPositionInDiferentColumns {
  taskA: Task;
  taskB: Task;
}
