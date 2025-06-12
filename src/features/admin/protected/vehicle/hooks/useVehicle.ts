import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  CreateVehicle,
  UpdateVehicle,
  DeleteVehicle,
  GetAllVehicle,
  FindVehicleById,
} from "../services/vehicle.service";
import type { IVehicle, ICreateVehicle } from "../types/vehicle.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export function useAllVehicle() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () => GetAllVehicle(),
    // enabled: !!token,
  });
}

export function useVehicleById(id: string, token: string) {
  return useQuery({
    queryKey: ["vehicles", id],
    queryFn: () => FindVehicleById(id, token),
    enabled: !!token && !!id,
  });
}

export function useCreateVehicle(token: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ICreateVehicle) =>
      CreateVehicle(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Vehicles"] });
    },
  });

  return mutation;
}

export function useUpdateVehicle(
  token: string
): UseMutationResult<
  IResponseGlobal<IVehicle>,
  Error,
  { id: string; data: IVehicle }
> {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IVehicle }) =>
      UpdateVehicle(id, data, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({
        queryKey: ["vehicles", variables.id],
      });
    },
  });

  return mutation;
}

export function useDeleteVehicle(
  token: string
): UseMutationResult<IResponseGlobal<string>, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteVehicle(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
