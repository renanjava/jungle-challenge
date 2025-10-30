import { useAuth } from "@/context/AuthContext";

export function DashboardPage() {
  const { accessToken, refreshToken } = useAuth();

  return (
    <p>
      Dashboard... {accessToken} / {refreshToken}
    </p>
  );
}
