import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export const ColumnsErrorState = ({
  onRetry,
  isRetrying = false,
}: {
  onRetry: () => void;
  isRetrying?: boolean;
}) => (
  <Alert className="mx-4 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
    <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
    <AlertDescription className="text-orange-800 dark:text-orange-200">
      <div className="flex items-center justify-between">
        <span>Error al cargar las columnas del tablero.</span>
        <Button
          onClick={onRetry}
          disabled={isRetrying}
          size="sm"
          variant="ghost"
          className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Reintentando
            </>
          ) : (
            "Reintentar"
          )}
        </Button>
      </div>
    </AlertDescription>
  </Alert>
);
