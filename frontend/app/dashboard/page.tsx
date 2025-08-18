import { KanbanBoard } from "@/components/kanban/kanban-board"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <main className="container h-full mx-auto px-4 py-6">
        <KanbanBoard />
      </main>
    </div>
  )
}
