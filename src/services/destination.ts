import axios from "axios"
import { DESTINATIONS } from "@/pages/api/destinations";
import base_url from ".";

export const getDestination = async () => {
  const { data } = await axios.post<DESTINATIONS[]>(`${base_url}/api/destinations`)
  return data;
}