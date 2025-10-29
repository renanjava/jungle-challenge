import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { loginSchema, type LoginFormValues } from "@/schemas/login.schema";
import { Lock, Mail } from "lucide-react";
import { useAuthLogin } from "@/hooks/useAuthLogin";
import { Link } from "@tanstack/react-router";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useAuthLogin();

  const onSubmit = async (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-9"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <a
              href="#"
              className="text-sm text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                alert("Adicionar o reset password posteriormente");
              }}
            >
              Esqueceu a senha?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="pl-9"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Nao tem uma conta?{" "}
          <Link
            className="text-primary hover:underline font-medium"
            to="/register"
          >
            Cadastre-se
          </Link>
        </div>
      </form>
    </CardContent>
  );
}
