import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  GetAllRefunds,
  GetRefundById,
  ApproveRefund,
  RejectRefund,
} from "../services/refund.service"; 
import type {
  RefundResponse,
  ApproveRefundPayload,
  RejectRefundPayload,
} from "../types/booking.type"; 
import type { IResponseGlobal } from "@/shared/types/standard-response";

export function useGetAllRefunds(token: string) {
  return useQuery({
    queryKey: ["refunds"], 
    queryFn: () => GetAllRefunds(token),
    enabled: !!token,
  });
}

export function useGetRefundById(refundId: string, token: string) {
  return useQuery({
    queryKey: ["refunds", refundId], 
    queryFn: () => GetRefundById(refundId, token),
    enabled: !!token && !!refundId,
  });
}

export function useApproveRefund(
  token: string
): UseMutationResult<
  IResponseGlobal<RefundResponse>,
  Error,
  { refundId: string; data: ApproveRefundPayload }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ refundId, data }: { refundId: string; data: ApproveRefundPayload }) =>
      ApproveRefund(refundId, data, token),
    
    onSuccess: (response) => {
      const bookingId = response.data.booking_id;
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
    },
  });
}

export function useRejectRefund(
  token: string
): UseMutationResult<
  IResponseGlobal<RefundResponse>,
  Error,
  { refundId: string; data: RejectRefundPayload }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ refundId, data }: { refundId: string; data: RejectRefundPayload }) =>
      RejectRefund(refundId, data, token),
      
    onSuccess: (response) => {
        const bookingId = response.data.booking_id;
        queryClient.invalidateQueries({ queryKey: ["refunds"] });
        queryClient.invalidateQueries({ queryKey: ["booking"] });
        queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
    },
  });
}