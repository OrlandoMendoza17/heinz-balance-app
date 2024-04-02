import axios from "axios";
import { NewExitParamsBodyProps } from "@/pages/api/exits/newExit";

type NewExitParams = NewExitParamsBodyProps

export const createNewExit = async (body: NewExitParams) => {
  const { data } = await axios.post("/api/exits/newExit", body)
  return data;
}

export const getTodaysExits = async () => {
  const { data } = await axios.get<P_SAL[]>("/api/exits/todaysExits")
  return data;
}