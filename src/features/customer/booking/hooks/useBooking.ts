import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  CreateBooking,
  UpdateBooking,
  GetAllBooking,
  FindBookingById,
  DeleteBooking,
  GetAllAvailableVehicle,
  GetUserBooking,
  GetUnavailableDatesForMultipleVehicles,
  RequestReschedule,
  RequestRefund,
  GetUnavailableDatesForVehicles,
} from "../service/booking.service";
import type {
  BookingResponse,
  CreateBookingPayload,
  RefundResponse,
  RequestRefundPayload,
  RequestReschedulePayload,
  RescheduleRequestResponse,
  SearchPayload,
  UnavailableDatesResponse,
  UpdateBookingPayload,
} from "../types/booking.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export function useAllBooking(token: string) {
  return useQuery({
    queryKey: ["booking"],
    queryFn: () => GetAllBooking(token),
    enabled: !!token,
  });
}

export function useAllBookingById(id: string, token: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => FindBookingById(id, token),
    enabled: !!token && !!id,
  });
}

export function useAllBookingUser(token: string) {
  return useQuery({
    queryKey: ["booking"],
    queryFn: () => GetUserBooking(token),
    enabled: !!token,
  });
}

export function useCreateBooking(token: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateBookingPayload) =>
      CreateBooking(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    },
  });

  return mutation;
}

export function useGetUnavailableDates(
  vehicleIds: string[] | null,
  excludeBookingId: string | null,
  token: string | null
) {
  return useQuery({
    queryKey: ["unavailableDates", vehicleIds, excludeBookingId],
    queryFn: async () => {
      if (
        !vehicleIds ||
        vehicleIds.length === 0 ||
        !token ||
        !excludeBookingId
      ) {
        return [];
      }
      const response = await GetUnavailableDatesForMultipleVehicles(
        { vehicleIds, excludeBookingId },
        token
      );
      if (response.success && Array.isArray(response.data)) {
        return response.data.map((dateStr) => new Date(dateStr));
      }
      throw new Error(response.message || "Failed to fetch unavailable dates.");
    },

    enabled:
      !!vehicleIds && vehicleIds.length > 0 && !!excludeBookingId && !!token,
  });
}

export function useGetAllAvailableVehicle() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SearchPayload) => GetAllAvailableVehicle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    },
  });

  return mutation;
}

export function useGetUnavailableDatesForVehicles(vehicleIds: string[]) {
  return useQuery<IResponseGlobal<UnavailableDatesResponse>, Error>({
    queryKey: ['unavailableVehicles', vehicleIds],
    queryFn: () => GetUnavailableDatesForVehicles(vehicleIds),
    enabled: !!vehicleIds && vehicleIds.length > 0, 
  });
}

export function useUpdateBooking(
  token: string
): UseMutationResult<
  IResponseGlobal<BookingResponse>,
  Error,
  { id: string; data: UpdateBookingPayload }
> {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingPayload }) =>
      UpdateBooking(id, data, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      queryClient.invalidateQueries({
        queryKey: ["booking", variables.id],
      });
    },
  });

  return mutation;
}

export function useDeleteBooking(
  token: string
): UseMutationResult<IResponseGlobal<string>, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteBooking(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    },
  });
}

export function useRequestReschedule(
  token: string
): UseMutationResult<
  IResponseGlobal<RescheduleRequestResponse>,
  Error,
  { bookingId: string; data: RequestReschedulePayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: RequestReschedulePayload;
    }) => RequestReschedule(bookingId, data, token),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      queryClient.invalidateQueries({
        queryKey: ["booking", variables.bookingId],
      });
    },
  });
}

export function useRequestRefund(
  token: string
): UseMutationResult<
  IResponseGlobal<RefundResponse>,
  Error,
  { bookingId: string; data: RequestRefundPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: RequestRefundPayload;
    }) => RequestRefund(bookingId, data, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      queryClient.invalidateQueries({
        queryKey: ["booking", variables.bookingId],
      });
    },
  });
}
