import axios from "axios";
import { API_GATEWAY_URL } from "./constants";

export async function createTaskAssignment(
  data: { user_id: string; task_id: string },
  accessToken: string | null
) {
  const response = await axios.post(
    API_GATEWAY_URL + "/api/tasks/assignment",
    data,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
}
