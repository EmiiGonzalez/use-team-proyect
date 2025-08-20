import { useMutation } from '@tanstack/react-query';
import { assignMember } from '@/service/boardmember/BoardMember';
import { AssignMemberForm } from '@/types/board/members/createAsingMembersForm';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/interfaces/api/apiResponseInterface';

export const useAssignMember = () => {
  return useMutation<AssignMemberForm, AxiosError<ApiErrorResponse>, AssignMemberForm>({
    mutationFn: assignMember,
  });
};
