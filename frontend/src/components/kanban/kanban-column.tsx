"use client"

import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KanbanCard } from "./kanban-card"
import { useKanbanStore } from "@/store/kanban-store"
import { toast } from "sonner"

interface Column {
  id: string
  title: string
  cards: Array<{
    id: string
    title: string
    description?: string
    columnId: string
  }>
}

interface KanbanColumnProps {
  column: Column
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState("")
  const { addCard, deleteColumn } = useKanbanStore()

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  })

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return

    try {
      await addCard(column.id, newCardTitle.trim())
      setNewCardTitle("")
      setIsAddingCard(false)
      toast.success("Tarjeta creada")
    } catch (error) {
      toast.error("Error al crear la tarjeta")
    }
  }

  const handleDeleteColumn = async () => {
    if (column.cards.length > 0) {
      if (!confirm("¿Estás seguro? Esta columna tiene tarjetas.")) return
    }

    try {
      await deleteColumn(column.id)
      toast.success("Columna eliminada")
    } catch (error) {
      toast.error("Error al eliminar la columna")
    }
  }

  return (
    <Card
      ref={setNodeRef}
      className={`min-w-80 max-w-80 transition-colors ${
        isOver ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
          <Button variant="ghost" size="sm" onClick={handleDeleteColumn} className="text-red-500 hover:text-red-700">
            ×
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {column.cards.length} tarjeta{column.cards.length !== 1 ? "s" : ""}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <SortableContext items={column.cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>

        {isAddingCard ? (
          <div className="space-y-2">
            <Input
              placeholder="Título de la tarjeta"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCard()
                if (e.key === "Escape") {
                  setIsAddingCard(false)
                  setNewCardTitle("")
                }
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddCard}>
                Agregar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingCard(false)
                  setNewCardTitle("")
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" className="w-full justify-start text-gray-500" onClick={() => setIsAddingCard(true)}>
            + Agregar tarjeta
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
