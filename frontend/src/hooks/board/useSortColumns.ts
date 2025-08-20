import { ColumnDTO } from "@/models/column/ColumnDTO";
import { useEffect } from "react";

export const useSortColumns = ( data: ColumnDTO[] | undefined, setColumns: (columns: ColumnDTO[]) => void ) => {
  useEffect(() => {
    if (data) {
      setColumns(
        data
          ?.map((column) => ({
            ...column,
            tasks: [...(column.tasks ?? [])].sort(
              (a, b) => a.position - b.position
            ),
          })) || []
      );
    }
  }, [data, setColumns]);
};
