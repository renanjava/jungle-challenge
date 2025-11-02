/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/context/AuthContext";
import type { IComments } from "@/interfaces/comments.interface";
import { createComments } from "@/services/createCommentsService";
import type { CreateCommentDto } from "@my-monorepo/shared-dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateComments = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<IComments, Error, { data: CreateCommentDto; id: string }>({
    mutationFn: ({ data, id }) => createComments(data, id, accessToken),
    onSuccess: (_response, variables) => {
      toast.success("Comentário adicionado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.id],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Falha no cadastro");
    },
  });
};
