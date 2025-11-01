/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/context/AuthContext";
import { createTaskAssignment } from "@/services/createTaskAssignmentService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateTaskAssignment = () => {
  const { accessToken } = useAuth();

  return useMutation<
    { user_id: string; task_id: string },
    Error,
    { user_id: string; task_id: string }
  >({
    mutationFn: (data) => createTaskAssignment(data, accessToken),
    onSuccess: () => {
      toast.success("Você ingressou na tarefa com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Falha no cadastro");
    },
  });
};
