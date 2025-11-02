import axios from "axios";
import { API_GATEWAY_URL } from "./constants";
import type { CreateCommentDto } from "@my-monorepo/shared-dtos";

export async function createComments(
  data: CreateCommentDto,
  taskId: string,
  accessToken: string | null
) {
  const response = await axios.post(
    API_GATEWAY_URL + `/api/tasks/${taskId}/comments`,
    data,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
}
