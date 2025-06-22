import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  GetAllRating,
  GetRatingById,
  GetRatingByTargetId,
  CreateRating,
  UpdateRating,
  DeleteRating,
} from "../service/rating.service";
import type {
  IRating,
  ICreateRatingPayload,
  IUpdateRatingPayload,
} from "../types/rating.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

type RatingQueryOptions<T> = Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>;

export function useAllRating() {
  return useQuery<IResponseGlobal<IRating[]>, Error>({
    queryKey: ["rating"],
    queryFn: () => GetAllRating(),
  });
}

export function useGetRatingById(id: string | undefined, token:string) {
  return useQuery<IResponseGlobal<IRating>, Error>({
    queryKey: ["rating", id],
    queryFn: () => GetRatingById(id as string, token),
    enabled: !!id && !!token,
  });
}

export function useGetRatingByTargetId(
  targetId: string | undefined,
  token: string,
  options?: RatingQueryOptions<IResponseGlobal<IRating[]>> 
) {
  return useQuery<IResponseGlobal<IRating[]>, Error>({
    queryKey: ["rating", "target", targetId],
    queryFn: () => GetRatingByTargetId(targetId as string, token),
    enabled: !!targetId && !!token,
    ...options,
  });
}

export function useCreateRating(
  token:string
): UseMutationResult<IResponseGlobal<IRating>, Error, ICreateRatingPayload> {
  const queryClient = useQueryClient();

  return useMutation<IResponseGlobal<IRating>, Error, ICreateRatingPayload>({
    mutationFn: (payload: ICreateRatingPayload) => CreateRating(payload, token),
    onSuccess: ( variables) => {
      queryClient.invalidateQueries({ queryKey: ["rating"] });
      
      queryClient.invalidateQueries({ queryKey: ["rating", "target", variables.data.targetId] });
    },
  });
}

export function useUpdateRating(
  token: string
): UseMutationResult<IResponseGlobal<IRating>, Error, { id: string; payload: IUpdateRatingPayload }> {
  const queryClient = useQueryClient();

  return useMutation<IResponseGlobal<IRating>, Error, { id: string; payload: IUpdateRatingPayload }>({
    mutationFn: ({ id, payload }) => UpdateRating(id, payload, token),
    onSuccess: (data) => { 
      queryClient.invalidateQueries({ queryKey: ["rating"] });
      queryClient.invalidateQueries({ queryKey: ["rating", data.data.id] });
      queryClient.invalidateQueries({ queryKey: ["rating", "target", data.data.targetId] });
    },
  });
}

export function useDeleteRating(
  token: string
): UseMutationResult<IResponseGlobal<void>, Error, string> {
  const queryClient = useQueryClient();

  return useMutation<IResponseGlobal<void>, Error, string>({
    mutationFn: (id: string) => DeleteRating(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rating"] });
    },
  });
}