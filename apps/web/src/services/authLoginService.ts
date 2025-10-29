import type { LoginFormValues } from "@/schemas/login.schema";
import axios from "axios";

const API_GATEWAY_URL = "http://localhost:3001";

export async function authLogin(data: LoginFormValues) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await axios.post(API_GATEWAY_URL + "/api/auth/login", data);
  return response.data;
}
