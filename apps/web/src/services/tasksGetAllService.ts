import axios from "axios";
import { API_GATEWAY_URL } from "./constants";

export async function tasksGetAll(accessToken: string | null) {
  const response = await axios.get(API_GATEWAY_URL + "/api/tasks", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data;
}
