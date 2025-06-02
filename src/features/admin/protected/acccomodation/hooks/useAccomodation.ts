import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  CreateAccomodation, UpdateAccomodation, FindAccomodationById, GetAllAccomodation, DeleteAccomodation
} from "../services/accomodation.service";
import type {
 IAccomodation,
 ICreateAccomodation
} from "../types/accomodation.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export function useAllAccomodation(token: string) {
  return useQuery({
    queryKey: ["accomodation"],
    queryFn: () => GetAllAccomodation(token),
    enabled: !!token,
  });
}

export function useAccomodationById(id: string, token: string) {
  return useQuery({
    queryKey: ["accomodation", id],
    queryFn: () => FindAccomodationById(id, token),
    enabled: !!token && !!id,
  });
}

export function useCreateAccomodation(token: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ICreateAccomodation) =>
      CreateAccomodation(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accomodation"] });
    },
  });

  return mutation;
}

export function useUpdateAccomodation(
  token: string
): UseMutationResult<
  IResponseGlobal<IAccomodation>,
  Error,
  { id: string; data: IAccomodation }
> {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IAccomodation }) =>
      UpdateAccomodation(id, data, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["accomodation"] });
      queryClient.invalidateQueries({
        queryKey: ["accomodation", variables.id],
      });
    },
  });

  return mutation;
}

export function useDeleteAccomodation(
  token: string
): UseMutationResult<IResponseGlobal<string>, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteAccomodation(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accomodation"] });
    },
  });
}
