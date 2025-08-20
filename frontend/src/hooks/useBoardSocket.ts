"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/webSocketProvider";
import { useAuthStore } from "@/store/auth/auth-store";
import { toast } from "sonner";

interface UseBoardSocketProps {
  boardId: string;
}

export const useBoardSocket = ({ boardId }: UseBoardSocketProps) => {
  const { socket, isConnected, boardUpdates, clearBoardUpdates } = useSocket();
  const queryClient = useQueryClient();
  const { id: idUser } = useAuthStore();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listener específico para actualizaciones del board
    const handleBoardUpdate = ({
      boardId: updatedBoardId,
      userId,
    }: {
      boardId: string;
      userId: string;
    }) => {
      if (boardId != updatedBoardId) return; // Solo manejar actualizaciones del board actual

      if (userId == idUser) {
        return; // Ignorar actualizaciones del propio usuario
      }

      // Invalidar queries relacionadas con el board
      queryClient.invalidateQueries({
        queryKey: ["board"],
      });

      queryClient.invalidateQueries({
        queryKey: ["columns", boardId],
      });

      toast.info("El tablero ha sido actualizado");
    };

    socket.on("board_updated", handleBoardUpdate);

    return () => {
      socket.off("board_updated", handleBoardUpdate);
    };
  }, [socket, isConnected, queryClient]);

  // Detectar si el board actual fue actualizado
  const isBoardUpdated = boardId ? boardUpdates.includes(boardId) : false;

  return {
    socket,
    isConnected,
    isBoardUpdated,
    clearBoardUpdates,
  };
};
