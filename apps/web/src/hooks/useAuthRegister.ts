/* eslint-disable @typescript-eslint/no-explicit-any */
import { authRegister } from "@/services/authRegisterService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAuthRegister = () => {
  return useMutation({
    mutationFn: authRegister,
    onSuccess: () => {
      toast.success("Cadastro realizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Falha no cadastro");
    },
  });
};
