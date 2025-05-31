import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  CreateTravelPack, UpdateTravelPack, FindTravelPackById, GetAllTravelPack, DeleteTravelPack
} from "../services/travel-pack.service";
import type { ICreateTravelPack, UpdateTravelPackDto } from "../types/travel-pack";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export function useAllTravelPack(token: string) {
  return useQuery({
    queryKey: ["travel"],
    queryFn: () => GetAllTravelPack(token),
    enabled: !!token,
  });
}

export function useTravelPackById(id: string, token: string) {
  return useQuery({
    queryKey: ["travel", id],
    queryFn: () => FindTravelPackById(id, token),
    enabled: !!token && !!id,
  });
}

export function useCreateTravelPack(token: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ICreateTravelPack) =>
      CreateTravelPack(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travel"] });
    },
  });

  return mutation;
}

export function useUpdateTravelPack(
  token: string
): UseMutationResult<
  IResponseGlobal<UpdateTravelPackDto>,
  Error,
  { id: string; data: UpdateTravelPackDto }
> {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTravelPackDto }) =>
      UpdateTravelPack(id, data, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["travel"] });
      queryClient.invalidateQueries({
        queryKey: ["travel", variables.id],
      });
    },
  });

  return mutation;
}

export function useDeleteTravelPack(
  token: string
): UseMutationResult<IResponseGlobal<string>, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteTravelPack(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travel"] });
    },
  });
}
