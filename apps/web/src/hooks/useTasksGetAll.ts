import { useQuery } from "@tanstack/react-query";
import { tasksGetAll } from "@/services/tasksGetAllService";
import type { ITask } from "@/interfaces/tasks.interface";
import { useAuth } from "@/context/AuthContext";

export const useTasksGetAll = () => {
  const { accessToken } = useAuth();

  return useQuery<ITask[]>({
    queryFn: () => tasksGetAll(accessToken),
    retry: false,
    queryKey: ["tasks"],
  });
};
