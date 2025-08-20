"use client";
import type React from "react";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskDTO, TaskStatus } from "@/models/task/taskDTO";
import { ChevronDown, ChevronRight, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { statusConfig } from "@/components/utils/StatusConfig";

interface KanbanCardProps {
  task: TaskDTO;
  isDragging?: boolean;
}

export function KanbanCard({ task, isDragging = false }: KanbanCardProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    data: { task }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("¿Estás seguro de eliminar esta tarjeta?")) return;
  };

  const toggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const statusInfo = task.status
    ? statusConfig[task.status]
    : statusConfig[TaskStatus.TODO];
  const StatusIcon = statusInfo.icon;

  const shouldTruncateDescription =
    task.description && task.description.length > 80;
  const displayDescription =
    shouldTruncateDescription && !isDescriptionExpanded
      ? task.description?.substring(0, 80) + "..."
      : task.description;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-move hover:shadow-md transition-all duration-200 border-l-4 ${
        task.status === TaskStatus.DONE
          ? "border-l-green-400"
          : task.status === TaskStatus.IN_PROGRESS
          ? "border-l-blue-400"
          : task.status === TaskStatus.BLOCKED
          ? "border-l-red-400"
          : "border-l-gray-300"
      } ${isDragging ? "rotate-2 shadow-xl scale-105" : ""}`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="space-y-3">
        {/* Header con título y acciones */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white leading-tight flex-1">
            {task.name}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Status badge */}
        {task.status && (
          <div className="flex items-center gap-1">
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
            >
              <StatusIcon className="h-3 w-3" />
              <span>{statusInfo.label}</span>
            </div>
          </div>
        )}

        {/* Descripción con expand/collapse */}
        {task.description && (
          <div className="space-y-1">
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {displayDescription}
            </p>
            {shouldTruncateDescription && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDescription}
                className="h-5 px-1 text-xs text-gray-500 hover:text-gray-700 p-0"
                onPointerDown={(e) => e.stopPropagation()}
              >
                {isDescriptionExpanded ? (
                  <div className="flex items-center gap-1">
                    <ChevronDown className="h-3 w-3" />
                    <span>Menos</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    <span>Más</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Footer con fecha de creación */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {format(new Date(task.createdAt), "dd MMM", { locale: es })}
            </span>
          </div>
          {task.position !== undefined && (
            <span className="text-gray-300">#{task.position}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
