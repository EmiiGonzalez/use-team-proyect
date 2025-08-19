export interface TaskDTO{
    id: string;
    columnId: string;
    boardId: string;
    creatorId?: string;
    name: string;
    description?: string;
    status?: TaskStatus;
    position: number;
    createdAt: Date;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED'
};