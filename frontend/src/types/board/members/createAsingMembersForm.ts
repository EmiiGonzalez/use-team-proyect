export interface AssignMemberForm {
  boardId: string;
  userId: string;
  role: BoardRole;
}
export enum BoardRole {
  OWNER = "OWNER",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER"
}