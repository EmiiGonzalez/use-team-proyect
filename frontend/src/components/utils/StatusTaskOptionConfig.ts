import { TaskStatus } from "@/models/task/taskDTO";
import { CheckCircle, Clock, ListTodo, XCircle } from "lucide-react";

export const statusOptions = [
  {
    value: TaskStatus.TODO,
    label: "Por hacer",
    icon: ListTodo,
    color: "text-gray-600",
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: "En progreso",
    icon: Clock,
    color: "text-blue-600",
  },
  {
    value: TaskStatus.DONE,
    label: "Completado",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    value: TaskStatus.BLOCKED,
    label: "Bloqueado",
    icon: XCircle,
    color: "text-red-600",
  },
];
