import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CustomToaster } from "../components/CustomToaster";
import { LoginForm } from "@/components/LoginForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Jungle Challenge
          </CardTitle>
          <CardDescription className="text-center">
            Entre com seu email e senha para continuar
          </CardDescription>
        </CardHeader>
        <LoginForm />
        <CustomToaster />
      </Card>
    </div>
  );
}
