/* eslint-disable @typescript-eslint/no-explicit-any */
import { authLogin } from "@/services/authLoginService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

export const useAuthLogin = () => {
  const { setTokens } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authLogin,
    onSuccess: (response) => {
      toast.success("Login realizado com sucesso!");
      setTokens(response.access_token, response.refresh_token);
      navigate({ to: "/dashboard" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Falha no login");
    },
  });
};
