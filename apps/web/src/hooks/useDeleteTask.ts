/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/context/AuthContext";
import { deleteTask } from "@/services/deleteTaskService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteTask = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, { id: string }>({
    mutationFn: (data) => deleteTask(accessToken, data.id),
    onSuccess: () => {
      toast.success("Tarefa deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Falha no cadastro");
    },
  });
};
