import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { assignVehicleAndConfirmBooking, FindBookingById, GetAllBookings, GetFullyBookedDatesForVehicles, UpdateBooking } from "../services/booking.service";
import type { AssignVehiclePayload, BookingResponse, UpdateBookingPayload } from "../types/booking.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export function useAllBooking(token:string) {
  return useQuery({
    queryKey: ["booking"],
    queryFn: () => GetAllBookings(token),
     enabled: !!token,
  });
}

export function useGetFullyBookedDates(vehicleIds: string[]) {
  return useQuery<IResponseGlobal<string[]>, Error>({
    queryKey: ['fullyBookedDates', vehicleIds],
    queryFn: () => GetFullyBookedDatesForVehicles(vehicleIds),
    enabled: !!vehicleIds && vehicleIds.length > 0, 
  });
}

export function useBookingById(id: string, token: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => FindBookingById(id, token),
    enabled: !!token && !!id,
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
      queryClient.invalidateQueries({ queryKey: ["accomodation"] });
      queryClient.invalidateQueries({
        queryKey: ["accomodation", variables.id],
      });
    },
  });

  return mutation;
}

export function useAssignVehicleAndConfirmBooking(
  token: string
): UseMutationResult<
  IResponseGlobal<BookingResponse>,
  Error,
  { id: string; data: AssignVehiclePayload }
> {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignVehiclePayload }) =>
      assignVehicleAndConfirmBooking(id, data, token),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["booking", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  return mutation;
}


