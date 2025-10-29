import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/schemas/register.schema";
import { Lock, Mail, User } from "lucide-react";
import { useAuthRegister } from "@/hooks/useAuthRegister";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useAuthRegister();

  const onSubmit = async (data: RegisterFormValues) => {
    mutate(data);
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Usuário</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              type="username"
              placeholder="username123"
              className="pl-9"
              {...register("username")}
            />
          </div>
          {errors.username && (
            <p className="text-sm text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>

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
          <Label htmlFor="password">Senha</Label>
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
          {isPending ? "Cadastrando..." : "Cadastrar"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Já possui uma conta?{" "}
          <a
            href="#"
            className="text-primary hover:underline font-medium"
            onClick={(e) => {
              e.preventDefault();
              alert("Ir para pagina de login");
            }}
          >
            Logar-se
          </a>
        </div>
      </form>
    </CardContent>
  );
}
