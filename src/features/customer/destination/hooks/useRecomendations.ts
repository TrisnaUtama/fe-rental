import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GetRecomendation } from "../services/recomendation.service";

export function useRecomendations(token: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user_id: string) => GetRecomendation(token, user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recomendations"] });
    },
  });

  return mutation;
}
