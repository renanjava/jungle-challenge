import { MainLayout } from "@/components/MainLayout";
import { useAuth } from "@/context/AuthContext";

export function DashboardPage() {
  const { accessToken, refreshToken } = useAuth();

  return (
    <MainLayout>
      <p>
        Dashboard... {accessToken} / {refreshToken}
      </p>
    </MainLayout>
  );
}
