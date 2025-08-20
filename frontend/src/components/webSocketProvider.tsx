"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

interface SocketContextType {
  socket: typeof Socket | null;
  isConnected: boolean;
  boardUpdates: string[];
  clearBoardUpdates: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  boardUpdates: [],
  clearBoardUpdates: () => {},
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [boardUpdates, setBoardUpdates] = useState<string[]>([]);

  useEffect(() => {
    // Función para obtener el token desde las cookies
    const getTokenFromCookie = () => {
      if (typeof document !== "undefined") {
        const name = "auth-token=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(";");

        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === " ") {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
      }
      return null;
    };

    const token = getTokenFromCookie();

    if (!token) {
      console.log("No token found, skipping socket connection");
      return;
    }

    // Crear conexión socket
    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const newSocket = io(`${socketUrl}/board`, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
    });

    // Event listeners
    newSocket.on("connect", () => {
      console.log("Conectado al servidor WebSocket");
      setIsConnected(true);
      toast.success("Conectado en tiempo real");
    });

    newSocket.on("disconnect", () => {
      console.log("Desconectado del servidor WebSocket");
      setIsConnected(false);
      toast.info("Desconectado del servidor");
    });

    newSocket.on("error", (error: { message: string }) => {
      console.error("Error de WebSocket:", error);
      toast.error(`Error de conexión: ${error.message}`);
      setIsConnected(false);
    });

    newSocket.on("board_updated", (data: { boardId: string }) => {
      console.log("Board actualizado:", data.boardId);
      setBoardUpdates((prev) => [...prev, data.boardId]);
      toast.info("El tablero ha sido actualizado");
    });

    newSocket.on("connect_error", () => {
      console.error("Error de conexión:");
      toast.error("Error al conectar con el servidor");
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      newSocket.close();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  const clearBoardUpdates = () => {
    setBoardUpdates([]);
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    boardUpdates,
    clearBoardUpdates,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
