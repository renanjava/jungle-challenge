/* eslint-disable @typescript-eslint/no-explicit-any */
import { authLogin } from "@/services/authLoginService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAuthLogin = () => {
  return useMutation({
    mutationFn: authLogin,
    onSuccess: () => {
      toast.success("Login realizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Falha no login");
    },
  });
};
