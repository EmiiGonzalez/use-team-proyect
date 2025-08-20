import { CreateColumnForm } from "./createColumnForm";

export interface UpdateColumnForm extends Omit<CreateColumnForm, 'position'> {
  name: string;
  id: string;
}