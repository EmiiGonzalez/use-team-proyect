import { create } from "zustand";

interface BoardMemberAssignStatus {
  isOpenModalAssign: boolean;
  setIsOpenModalAssign: (open: boolean) => void;
  idBoard: string | null;
  setIdBoard: (board: string | null) => void;
}

export const useBoardMemberAssignStore = create<BoardMemberAssignStatus>(
  (set) => ({
    isOpenModalAssign: false,
    setIsOpenModalAssign: (open) => set({ isOpenModalAssign: open }),
    idBoard: null,
    setIdBoard: (board) => set({ idBoard: board }),
  })
);
