"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BoardDTO } from "@/models/board/BoardDTO";
import { useBoardMemberAssignStore } from "@/store/boards/boardmember/useColumnStore";
import {
  Calendar,
  ArrowRight,
  UserPlus,
  Folder,
} from "lucide-react";

export const BoardCard = ({ board }: { board: BoardDTO }) => {
  const router = useRouter();
  const { setIsOpenModalAssign, setIdBoard } = useBoardMemberAssignStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const handleOpenBoard = () => {
    router.push(`/dashboard/${board.id}`);
  };

  const handleAssignMember = () => {
    setIsOpenModalAssign(true);
    setIdBoard(board.id);
  };

  return (
    <Card className="group relative p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Folder className="h-4 w-4 text-gray-600" />
          </div>
          <h3 className="font-semibold text-gray-900 truncate text-sm">
            {board.name}
          </h3>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(board.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleOpenBoard}
          size="sm"
          className="flex-1 h-8 text-xs"
        >
          <span>Abrir</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAssignMember}
          className="h-8 px-2"
        >
          <UserPlus className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};
