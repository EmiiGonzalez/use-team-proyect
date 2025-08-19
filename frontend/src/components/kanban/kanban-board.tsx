"use client"

import { useState, useEffect } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, closestCorners } from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useKanbanStore } from "@/store/kanban-store"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { useGetBoard } from "@/hooks/api/boards/useBoards"

export function KanbanBoard() {
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [activeCard, setActiveCard] = useState<any>(null)
  const { columns, addColumn, loadBoard, moveCard } = useKanbanStore()
  const { id } = useParams<{ id: string }>()

  const { data: board } = useGetBoard(id);

  useEffect(() => {
    // Cargar el tablero al montar el componente
    loadBoard()
  }, [loadBoard])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const cardId = active.id as string

    // Encontrar la tarjeta que se está arrastrando
    const card = columns.flatMap((col) => col.cards).find((card) => card.id === cardId)

    setActiveCard(card)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const cardId = active.id as string
    const overId = over.id as string

    // Si se suelta sobre una columna
    if (overId.startsWith("column-")) {
      const targetColumnId = overId.replace("column-", "")
      await moveCard(cardId, targetColumnId)
      toast.success("Tarjeta movida")
    }
    // Si se suelta sobre otra tarjeta, mover a esa columna
    else {
      const targetCard = columns.flatMap((col) => col.cards).find((card) => card.id === overId)

      if (targetCard && targetCard.columnId !== activeCard?.columnId) {
        await moveCard(cardId, targetCard.columnId)
        toast.success("Tarjeta movida")
      }
    }
  }

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return

    try {
      await addColumn(newColumnTitle.trim())
      setNewColumnTitle("")
      setIsAddingColumn(false)
      toast.success("Columna creada")
    } catch (error) {
      toast.error("Error al crear la columna")
    }
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{board?.name}</h2>
        <Button onClick={() => setIsAddingColumn(true)}>+ Agregar Columna</Button>
      </div>

      <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6">
          <SortableContext items={columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </SortableContext>

          {isAddingColumn && (
            <Card className="min-w-80 p-4">
              <div className="space-y-3">
                <Input
                  placeholder="Título de la columna"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddColumn()
                    if (e.key === "Escape") {
                      setIsAddingColumn(false)
                      setNewColumnTitle("")
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddColumn}>
                    Agregar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingColumn(false)
                      setNewColumnTitle("")
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        <DragOverlay>{activeCard ? <KanbanCard card={activeCard} isDragging /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}
