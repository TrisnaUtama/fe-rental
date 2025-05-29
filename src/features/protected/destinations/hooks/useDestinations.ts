import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  CreateDestination,
  UpdateDestination,
  DeleteDestination,
  GetAllDestination,
  FindDestinationById,
} from "../services/destination.service";
import type {
  IDestination,
  ICreateDestination,
} from "../types/destination.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export function useAllDestinations(token: string) {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: () => GetAllDestination(token),
    enabled: !!token,
  });
}

export function useDestinationById(id: string, token: string) {
  return useQuery({
    queryKey: ["destinations", id],
    queryFn: () => FindDestinationById(id, token),
    enabled: !!token && !!id,
  });
}

export function useCreateDestination(token: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ICreateDestination) => CreateDestination(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
    },
  });

  return mutation;
}

export function useUpdateDestination(
  token: string
): UseMutationResult<
  IResponseGlobal<IDestination>,
  Error,
  { id: string; data: IDestination }
> {
  const queryClient = useQueryClient();

   const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IDestination }) =>
      UpdateDestination(id, data, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      queryClient.invalidateQueries({
        queryKey: ["destinations", variables.id],
      });
    },
  });

  return mutation
}

export function useDeleteDestination(
  token: string
): UseMutationResult<IResponseGlobal<string>, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteDestination(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
    },
  });
}
