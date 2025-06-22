import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import {
  CreatePromo,
  UpdatePromo,
  DeletePromo,
  GetAllPromo,
  GetOnePromo,
} from "../services/promo.service";

import type {
  IPromo,
  CreatePromo as ICreatePromo,
  UpdatePromo as IUpdatePromo,
} from "../types/promo.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export function useAllPromos(token: string) {
  return useQuery({
    queryKey: ["promos"],
    queryFn: () => GetAllPromo(token),
  });
}

export function usePromoById(id: string, token: string) {
  return useQuery({
    queryKey: ["promos", id],
    queryFn: () => GetOnePromo(id, token),
    enabled: !!id,
  });
}

export function useCreatePromo(
  token: string
): UseMutationResult<IResponseGlobal<IPromo>, Error, ICreatePromo> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreatePromo) => CreatePromo(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promos"] });
    },
  });
}

export function useUpdatePromo(
  token: string
): UseMutationResult<
  IResponseGlobal<IPromo>,
  Error,
  { id: string; data: IUpdatePromo }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdatePromo }) =>
      UpdatePromo(id, data, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["promos"] });
      queryClient.invalidateQueries({ queryKey: ["promos", variables.id] });
    },
  });
}

export function useDeletePromo(
  token: string
): UseMutationResult<IResponseGlobal<string>, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeletePromo(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promos"] });
    },
  });
}
