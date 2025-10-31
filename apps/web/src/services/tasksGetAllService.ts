import axios from "axios";
import { API_GATEWAY_URL } from "./constants";

export async function tasksGetAll(
  accessToken: string | null,
  page: number = 1,
  size: number = 6
) {
  console.log({ page, size });

  const response = await axios.get(API_GATEWAY_URL + "/api/tasks", {
    params: { page, size },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}
