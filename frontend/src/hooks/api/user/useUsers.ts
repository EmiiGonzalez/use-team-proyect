import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@/service/user/UserService';
import { UserEmailDTO } from '@/models/user/UserDTO';

export const useUsers = (email: string) => {
  return useQuery<UserEmailDTO[]>({
    queryKey: ['users', email],
    queryFn: () => getAllUsers(email),
    enabled: !!email,
  });
};
