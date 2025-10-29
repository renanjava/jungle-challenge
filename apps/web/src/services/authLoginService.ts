import type { LoginFormValues } from "@/schemas/login.schema";
import axios from "axios";
import { API_GATEWAY_URL } from "./constants";

export async function authLogin(data: LoginFormValues) {
  const response = await axios.post(API_GATEWAY_URL + "/api/auth/login", data);
  return response.data;
}
