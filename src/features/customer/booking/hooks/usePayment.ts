import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
GetAllPayment,
FindPaymentById,
UserPaying
} from "../service/payment.service";
import type { IResponseGlobal } from "@/shared/types/standard-response";
import type { IPaymentSnap } from "../types/payment.type";

export function useAllPayment(token: string) {
  return useQuery({
    queryKey: ["payment"],
    queryFn: () => GetAllPayment(token),
    enabled: !!token,
  });
}

export function useAllPaymentById(id: string, token: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => FindPaymentById(id, token),
    enabled: !!token && !!id,
  });
}


export function useUpdatePayment(
  token: string,
): UseMutationResult<
  IResponseGlobal<IPaymentSnap>,
  Error,
  { id: string; }
> {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }: { id: string}) =>
      UserPaying(id, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payment"] });
      queryClient.invalidateQueries({
        queryKey: ["payment", variables.id],
      });
    },
  });

  return mutation;
}
