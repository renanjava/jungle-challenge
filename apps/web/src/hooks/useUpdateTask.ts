/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/context/AuthContext";
import { updateTask } from "@/services/updateTaskService";
import type { UpdateTaskDto } from "@my-monorepo/shared-dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateTask = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<UpdateTaskDto, Error, { data: UpdateTaskDto; id: string }>(
    {
      mutationFn: ({ data, id }) => updateTask(data, accessToken, id),
      onSuccess: () => {
        toast.success("Tarefa atualizada com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Falha na atualização");
      },
    }
  );
};
