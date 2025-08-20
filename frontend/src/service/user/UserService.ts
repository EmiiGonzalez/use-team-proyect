import { UserEmailDTO } from "@/models/user/UserDTO";
import { createHttpClient } from "../../../client/HttpClient";

const client = createHttpClient("api/v1/user");

// Obtener todos los usuarios
export const getAllUsers = async (email: string): Promise<UserEmailDTO[]> => {
  const response = await client.get<UserEmailDTO[]>(`/${email}`);
  return response.data;
};
