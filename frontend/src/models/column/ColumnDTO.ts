import { TaskDTO } from "../task/taskDTO";

export interface ColumnDTO {
  id: string;
  name: string;
  position: number;
  tasks: TaskDTO[];
}
