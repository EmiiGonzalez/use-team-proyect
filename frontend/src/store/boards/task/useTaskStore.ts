import { TaskDTO } from "@/models/task/taskDTO";
import { create } from "zustand";

interface TaskState {
  isUpdatingTask: boolean;
  setIsUpdatingTask: (open: boolean) => void;
  activeTask: TaskDTO | null;
  setActiveTask: (column: TaskDTO | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  isUpdatingTask: false,
  setIsUpdatingTask: (open) => set({ isUpdatingTask: open }),
  activeTask: null,
  setActiveTask: (task) => set({ activeTask: task }),
}));
