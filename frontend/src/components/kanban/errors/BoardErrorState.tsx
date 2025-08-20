"use client";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  RefreshCw, 
  WifiOff,
  AlertCircle 
} from "lucide-react";

// Componente de error para el board
export const BoardErrorState = ({ 
  onRetry, 
  isRetrying = false,
  errorType = "general"
}: { 
  onRetry: () => void;
  isRetrying?: boolean;
  errorType?: "network" | "not_found" | "unauthorized" | "general";
}) => {
  const getErrorConfig = () => {
    switch (errorType) {
      case "network":
        return {
          icon: WifiOff,
          title: "Sin conexión",
          message: "No se pudo conectar al servidor. Verifica tu conexión a internet.",
          buttonText: "Reintentar conexión"
        };
      case "not_found":
        return {
          icon: AlertTriangle,
          title: "Board no encontrado",
          message: "El tablero que buscas no existe o ha sido eliminado.",
          buttonText: "Volver al inicio"
        };
      case "unauthorized":
        return {
          icon: AlertCircle,
          title: "Acceso denegado",
          message: "No tienes permisos para ver este tablero.",
          buttonText: "Verificar acceso"
        };
      default:
        return {
          icon: AlertTriangle,
          title: "Error al cargar",
          message: "Hubo un problema al cargar el tablero. Por favor, inténtalo de nuevo.",
          buttonText: "Reintentar"
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {config.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            {config.message}
          </p>
        </div>
        <Button
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-4"
          variant="outline"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Reintentando...
            </>
          ) : (
            config.buttonText
          )}
        </Button>
      </div>
    </div>
  );
};
