import { Clock } from "lucide-react";

export const LoadingState = ({ message = "Cargando tablero..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center h-96 space-y-4">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div className="text-center space-y-2">
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      <div className="flex items-center justify-center space-x-1">
        <Clock className="w-3 h-3 text-gray-400" />
        <span className="text-xs text-gray-400">Esto puede tomar unos segundos</span>
      </div>
    </div>
  </div>
);