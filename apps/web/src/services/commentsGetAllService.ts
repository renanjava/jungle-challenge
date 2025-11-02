import axios from "axios";
import { API_GATEWAY_URL } from "./constants";

export async function commentsGetAll(
  accessToken: string | null,
  taskId: string,
  page: number = 1,
  size: number = 6
) {
  const response = await axios.get(
    API_GATEWAY_URL + `/api/tasks/${taskId}/comments`,
    {
      params: { page, size },
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
}
