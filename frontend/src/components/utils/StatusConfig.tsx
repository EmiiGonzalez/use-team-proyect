import { TaskStatus } from "@/models/task/taskDTO";
import { AlertTriangle, CheckCircle, Clock, Play } from "lucide-react";

export const statusConfig = {
  [TaskStatus.TODO]: {
    label: "Por hacer",
    icon: Clock,
    variant: "secondary" as const,
    color: "bg-gray-100 text-gray-700",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "En progreso",
    icon: Play,
    variant: "default" as const,
    color: "bg-blue-100 text-blue-700",
  },
  [TaskStatus.DONE]: {
    label: "Completado",
    icon: CheckCircle,
    variant: "default" as const,
    color: "bg-green-100 text-green-700",
  },
  [TaskStatus.BLOCKED]: {
    label: "Bloqueado",
    icon: AlertTriangle,
    variant: "destructive" as const,
    color: "bg-red-100 text-red-700",
  },
};