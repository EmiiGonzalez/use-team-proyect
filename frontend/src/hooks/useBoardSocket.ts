"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/webSocketProvider";

interface UseBoardSocketProps {
  boardId: string;
}

export const useBoardSocket = ({ boardId }: UseBoardSocketProps) => {
  const { socket, isConnected, boardUpdates, clearBoardUpdates } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listener específico para actualizaciones del board
    const handleBoardUpdate = () => {
      // Invalidar queries relacionadas con el board
      queryClient.invalidateQueries({
        queryKey: ["board"],
      });

      queryClient.invalidateQueries({
        queryKey: ["columns", boardId],
      });

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
