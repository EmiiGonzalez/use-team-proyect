import { ColumnDTO } from "@/models/column/ColumnDTO";
import { getAllColumns } from "@/service/column/ColumnService";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook para obtener todos los tableros usando TanStack Query
 */
export const useAllColumnQuery = (idBoard: string) => {
  return useQuery<ColumnDTO[]>({
    queryKey: ["columns", idBoard],
    queryFn: () => getAllColumns(idBoard),
    enabled: !!idBoard, // Solo ejecutar si idBoard está definido
  });
};

// export const useGetBoard = (id: string) => {
//   return useQuery<BoardDTO>({
//     queryKey: ["board", id],
//     queryFn: () => getBoardById(id),
//   });
// };
