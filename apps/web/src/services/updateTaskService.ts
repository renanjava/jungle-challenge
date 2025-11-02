import axios from "axios";
import { API_GATEWAY_URL } from "./constants";
import type { UpdateTaskDto } from "@my-monorepo/shared-dtos";

export async function updateTask(
  data: UpdateTaskDto,
  accessToken: string | null,
  taskId: string
) {
  const response = await axios.put(
    API_GATEWAY_URL + "/api/tasks/" + taskId,
    data,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
}
