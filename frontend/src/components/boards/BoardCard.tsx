"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BoardDTO } from "@/models/board/BoardDTO";

export const BoardCard = ({ board }: { board: BoardDTO }) => {
  const router = useRouter();

  return (
    <Card className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-lg font-semibold">{board.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Creado: {new Date(board.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4">
        <Button onClick={() => router.push(`/dashboard/${board.id}`)}>
          Abrir tablero
        </Button>
      </div>
    </Card>
  );
}
