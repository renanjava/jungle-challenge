import axios from "axios";
import { API_GATEWAY_URL } from "./constants";

export async function refreshAccessToken(refreshToken: string | null) {
  const response = await axios.post(
    API_GATEWAY_URL + "/api/auth/refresh",
    {},
    {
      headers: {
        "x-refresh-token": refreshToken,
      },
    }
  );
  return response.data.access_token;
}
