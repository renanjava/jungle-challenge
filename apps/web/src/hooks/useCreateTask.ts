/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/context/AuthContext";
import type { CreateTaskFormValues } from "@/schemas/create-task.schema";
import { createTask } from "@/services/createTaskService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateTask = () => {
  const { accessToken } = useAuth();

  return useMutation<CreateTaskFormValues, Error, CreateTaskFormValues>({
    mutationFn: (data) => createTask(data, accessToken),
    onSuccess: () => {
      toast.success("Tarefa cadastrada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Falha no cadastro");
    },
  });
};
