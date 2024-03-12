import axios from "axios"
import { DESTINATIONS } from "@/pages/api/destinations";

export const getDestination = async () => {
  const { data } = await axios.post<DESTINATIONS[]>("/api/destinations")
  return data;
}