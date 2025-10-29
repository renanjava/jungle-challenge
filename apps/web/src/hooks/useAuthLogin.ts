/* eslint-disable @typescript-eslint/no-explicit-any */
import { authLogin } from "@/services/authLoginService";
import { useMutation } from "@tanstack/react-query";

export const useAuthLogin = () => {
  return useMutation({
    mutationFn: authLogin,
    onSuccess: () => {
      alert(`Usuário logado:`);
    },
    onError: (error: any) => {
      alert(`Erro ao logar: ${error.message}`);
    },
  });
};
