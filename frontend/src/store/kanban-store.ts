import { create } from "zustand"

interface Card {
  id: string
  title: string
  description?: string
  columnId: string
}

interface Column {
  id: string
  title: string
  cards: Card[]
}

interface KanbanState {
  columns: Column[]
  setColumns: (columns: Column[]) => void
  addColumn: (title: string) => Promise<void>
  deleteColumn: (columnId: string) => Promise<void>
  addCard: (columnId: string, title: string) => Promise<void>
  deleteCard: (cardId: string) => Promise<void>
  moveCard: (cardId: string, targetColumnId: string) => Promise<void>
  loadBoard: () => Promise<void>
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  columns: [],

  setColumns: (columns) => set({ columns }),

  addColumn: async (title) => {
    // Aquí conectarás con tu API de NestJS
    const newColumn: Column = {
      id: Date.now().toString(),
      title,
      cards: [],
    }

    set((state) => ({
      columns: [...state.columns, newColumn],
    }))
  },

  deleteColumn: async (columnId) => {
    // Aquí conectarás con tu API de NestJS
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== columnId),
    }))
  },

  addCard: async (columnId, title) => {
    // Aquí conectarás con tu API de NestJS
    const newCard: Card = {
      id: Date.now().toString(),
      title,
      columnId,
    }

    set((state) => ({
      columns: state.columns.map((col) => (col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col)),
    }))
  },

  deleteCard: async (cardId) => {
    // Aquí conectarás con tu API de NestJS
    set((state) => ({
      columns: state.columns.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      })),
    }))
  },

  moveCard: async (cardId, targetColumnId) => {
    // Aquí conectarás con tu API de NestJS
    const { columns } = get()
    let cardToMove: Card | null = null

    // Encontrar y remover la tarjeta de su columna actual
    const updatedColumns = columns.map((col) => {
      const cardIndex = col.cards.findIndex((card) => card.id === cardId)
      if (cardIndex !== -1) {
        cardToMove = { ...col.cards[cardIndex], columnId: targetColumnId }
        return {
          ...col,
          cards: col.cards.filter((card) => card.id !== cardId),
        }
      }
      return col
    })

    // Agregar la tarjeta a la nueva columna
    if (cardToMove) {
      const finalColumns = updatedColumns.map((col) =>
        col.id === targetColumnId ? { ...col, cards: [...col.cards, cardToMove!] } : col,
      )

      set({ columns: finalColumns })
    }
  },

  loadBoard: async () => {
    // Aquí conectarás con tu API de NestJS para cargar el tablero
    // Por ahora, datos de ejemplo
    const mockColumns: Column[] = [
      {
        id: "1",
        title: "Por hacer",
        cards: [
          { id: "1", title: "Tarea de ejemplo 1", columnId: "1" },
          { id: "2", title: "Tarea de ejemplo 2", columnId: "1" },
        ],
      },
      {
        id: "2",
        title: "En progreso",
        cards: [{ id: "3", title: "Tarea en desarrollo", columnId: "2" }],
      },
      {
        id: "3",
        title: "Completado",
        cards: [],
      },
    ]

    set({ columns: mockColumns })
  },
}))
