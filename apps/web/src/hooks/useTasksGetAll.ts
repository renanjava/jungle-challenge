import { useQuery } from "@tanstack/react-query";
import { tasksGetAll } from "@/services/tasksGetAllService";
import type { ITask } from "@/interfaces/tasks.interface";
import { useAuth } from "@/context/AuthContext";
import { refreshAccessToken } from "@/services/refreshAccessTokenService";

export const useTasksGetAll = () => {
  const { accessToken, setAccess, refreshToken } = useAuth();

  return useQuery<ITask[]>({
    queryFn: async () => {
      try {
        return await tasksGetAll(accessToken);
      } catch (err: any) {
        if (err.response?.status === 401) {
          const newToken = await refreshAccessToken(refreshToken);
          setAccess(newToken);
          return await tasksGetAll(newToken);
        }
        throw err;
      }
    },
    retry: false,
    queryKey: ["tasks"],
  });
};
