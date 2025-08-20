"use client";

import { BoardDTO } from "@/models/board/BoardDTO";
import { BoardCard } from "./BoardCard";

export const BoardGrid = ({ boards }: { boards: BoardDTO[] }) => {
  if (!boards.length) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Todavía no tenés tableros. Creá el primero 👇
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {boards.map((b) => (
        <BoardCard key={b.id} board={b} />
      ))}
    </div>
  );
}
