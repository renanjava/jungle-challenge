import axios from "axios";
import { API_GATEWAY_URL } from "./constants";
import type { CreateTaskFormValues } from "@/schemas/create-task.schema";

export async function createTask(
  data: CreateTaskFormValues,
  accessToken: string | null
) {
  const response = await axios.post(API_GATEWAY_URL + "/api/tasks", data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}
