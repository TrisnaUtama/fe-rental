import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateImage,
  UploadImage,
  DeleteImage,
} from "@/shared/services/storage.service";
import type { IUpdateImage } from "../types/storage.type";

export function useDeleteImage(token: string) {
  return useMutation({
    mutationFn: (filename: string) => DeleteImage(filename, token),
  });
}

export function useUploadImage(token: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: File) => UploadImage(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storages"] });
    },
  });

  return mutation;
}

export function useUpdateImage(token: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: IUpdateImage) => UpdateImage(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storages"] });
    },
  });

  return mutation;
}
