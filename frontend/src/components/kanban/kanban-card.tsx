"use client"

import type React from "react"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useKanbanStore } from "@/store/kanban-store"
import { toast } from "sonner"
import { TaskDTO } from "@/models/task/taskDto"


interface KanbanCardProps {
  task: TaskDTO
  isDragging?: boolean
}

export function KanbanCard({ task, isDragging = false }: KanbanCardProps) {
  const { deleteCard } = useKanbanStore()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevenir que se active el drag
    if (!confirm("¿Estás seguro de eliminar esta tarjeta?")) return

    try {
      await deleteCard(task.id)
      toast.success("Tarjeta eliminada")
    } catch (error) {
      toast.error("Error al eliminar la tarjeta")
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-move hover:shadow-md transition-shadow ${isDragging ? "rotate-3 shadow-lg" : ""}`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">{task.name}</h4>
            {task.description && <p className="text-xs text-gray-600 dark:text-gray-400">{task.description}</p>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 ml-2"
            onPointerDown={(e) => e.stopPropagation()} // Prevenir drag al hacer click en eliminar
          >
            ×
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
