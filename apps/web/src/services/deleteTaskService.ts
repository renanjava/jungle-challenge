import axios from "axios";
import { API_GATEWAY_URL } from "./constants";

export async function deleteTask(accessToken: string | null, taskId: string) {
  const response = await axios.delete(
    API_GATEWAY_URL + "/api/tasks/" + taskId,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
}
