import { ColumnDTO } from "@/models/column/ColumnDTO";
import { create } from "zustand";

interface ColumnState {
  isUpdatingColumn: boolean;
  setIsUpdatingColumn: (open: boolean) => void;
  activeColumn: ColumnDTO | null;
  setActiveColumn: (column: ColumnDTO | null) => void;
}

export const useColumnStore = create<ColumnState>((set) => ({
  isUpdatingColumn: false,
  setIsUpdatingColumn: (open) => set({ isUpdatingColumn: open }),
  activeColumn: null,
  setActiveColumn: (column) => set({ activeColumn: column }),
}));
