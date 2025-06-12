import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  CreateTravelPack,
  UpdateTravelPack,
  FindTravelPackById,
  GetAllTravelPack,
  DeleteTravelPack,
  addNewItineraries,
  addNewPax,
  addNewDestination,
} from "../services/travel-pack.service";
import type {
  AddNewDest,
  AddNewItinerariesDto,
  AddNewPax,
  ICreateTravelPack,
  UpdateTravelPackDto,
} from "../types/travel-pack";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export function useAllTravelPack() {
  return useQuery({
    queryKey: ["travel"],
    queryFn: () => GetAllTravelPack(),

  });
}

export function useTravelPackById(id: string) {
  return useQuery({
    queryKey: ["travel", id],
    queryFn: () => FindTravelPackById(id),
    enabled: !!id,
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

export function useAddNewItineraries(token: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    IResponseGlobal<any>,
    Error,
    AddNewItinerariesDto
  >({
    mutationFn: (payload) => addNewItineraries(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travel"] });
    },
  });

  return mutation;
}

export function useAddNewPax(token: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation<IResponseGlobal<any>, Error, AddNewPax>({
    mutationFn: (payload) => addNewPax(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travel"] });
    },
  });

  return mutation;
}

export function useAddNewDestination(token: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation<IResponseGlobal<any>, Error, AddNewDest>({
    mutationFn: (payload) => addNewDestination(payload, token),
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
