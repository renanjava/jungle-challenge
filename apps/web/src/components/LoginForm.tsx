import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { loginSchema, type LoginFormValues } from "@/schemas/login.schema";
import { Lock, Mail } from "lucide-react";
import { useAuthLogin } from "@/hooks/useAuthLogin";
import { Toaster } from "react-hot-toast";

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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Jungle Challenge
        </CardTitle>
        <CardDescription className="text-center">
          Entre com seu email e senha para continuar
        </CardDescription>
      </CardHeader>
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
            <a
              href="#"
              className="text-primary hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                alert("Ir para pagina de cadastro");
              }}
            >
              Cadastre-se
            </a>
          </div>
        </form>
      </CardContent>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#1f2937",
            color: "#fff",
            padding: "16px",
            fontWeight: "500",
          },
          success: {
            icon: "✅",
            style: {
              background: "#16a34a",
              color: "#fff",
            },
          },
          error: {
            icon: "❌",
            style: {
              background: "#dc2626",
              color: "#fff",
            },
          },
        }}
      />
    </Card>
  );
}
