import { createHttpClient } from "../../../client/HttpClient";
import { AssignMemberForm } from "@/types/board/members/createAsingMembersForm";

const client = createHttpClient("api/v1/board-members");

// Asignar un miembro a un board
export const assignMember = async (data: AssignMemberForm): Promise<AssignMemberForm> => {
  const response = await client.post<AssignMemberForm>(``, data);
  return response.data;
};
