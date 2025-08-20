import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff } from "lucide-react";

export const ConnectionStatus = ({ isConnected }: { isConnected: boolean }) => {
  if (isConnected) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 shadow-lg">
        <div className="flex items-center space-x-2">
          {<WifiOff className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
          <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-sm">
            Sin conexión
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
};
