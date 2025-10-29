import type { RegisterFormValues } from "@/schemas/register.schema";
import axios from "axios";
import { API_GATEWAY_URL } from "./constants";

export async function authRegister(data: RegisterFormValues) {
  const response = await axios.post(
    API_GATEWAY_URL + "/api/auth/register",
    data
  );
  return response.data;
}
