"use client";

import BoardGrid from "@/components/boards/BoardGrid";

import { CreateBoardDialog } from "@/components/boards/CreateBoardDialog";
import { useAllBoardsQuery } from "@/hooks/api/boards/useBoards";

export default function BoardsPage() {
  const { data, isLoading, error } = useAllBoardsQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mis tableros</h1>
        <CreateBoardDialog />
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Cargando…</div>
      ) : (
        <>
          {error && (
            <div className="text-sm text-red-500">
              Error al cargar los tableros
            </div>
          )}
          {data && data.length > 0 ? (
            <BoardGrid boards={data} />
          ) : (
            <div className="text-sm text-muted-foreground">No hay tableros</div>
          )}
        </>
      )}
    </div>
  );
}
