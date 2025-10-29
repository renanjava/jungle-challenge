import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CustomToaster } from "../components/CustomToaster";
import { RegisterForm } from "@/components/RegisterForm";

export function RegisterPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Jungle Challenge
        </CardTitle>
        <CardDescription className="text-center">
          Preencha seu email e senha para cadastrar-se
        </CardDescription>
      </CardHeader>
      <RegisterForm />
      <CustomToaster />
    </Card>
  );
}
