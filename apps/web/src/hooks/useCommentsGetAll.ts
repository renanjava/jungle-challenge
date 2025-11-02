import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { refreshAccessToken } from "@/services/refreshAccessTokenService";
import type { IPaginatedComments } from "@/interfaces/comments.interface";
import { commentsGetAll } from "@/services/commentsGetAllService";

export const useCommentsGetAll = (
  taskId: string,
  page: number = 1,
  size: number = 6
) => {
  const { accessToken, setAccess, refreshToken } = useAuth();

  return useQuery<IPaginatedComments>({
    queryFn: async () => {
      try {
        return await commentsGetAll(accessToken, taskId, page, size);
      } catch (err: any) {
        if (err.response?.status === 401) {
          const newToken = await refreshAccessToken(refreshToken);
          setAccess(newToken);
          return await commentsGetAll(newToken, taskId);
        }
        throw err;
      }
    },
    retry: false,
    queryKey: ["comments", page, size],
  });
};
