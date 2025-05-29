import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  CreateUser,
  DeleteUser,
  FindUserById,
  GetAllUsers,
  UpdateUser,
} from "../services/user.service";
import type { IUser, ICreateUser } from "../types/user.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export function useAllUsers(token: string) {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => GetAllUsers(token),
    enabled: !!token,
  });
}

export function useUserById(userId: string, token: string) {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => FindUserById(userId, token),
    enabled: !!token && !!userId,
  });
}

export function useCreateUser(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateUser) => CreateUser(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser(
  token: string
): UseMutationResult<
  IResponseGlobal<IUser>,
  Error,
  { userId: string; data: IUser }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: IUser }) =>
      UpdateUser(userId, data, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
    },
  });
}

export function useDeleteUser(
  token: string
): UseMutationResult<IResponseGlobal<string>, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => DeleteUser(userId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
