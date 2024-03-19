import axios from "axios";
import { NewExit } from "@/components/pages/VehiculesExit";

type newExitParams = {
  leavingEntry: NewExit,
  updateEntryByDestination: object | undefined,
}

export const createNewExit = async (body: newExitParams) => {
  const { data } = await axios.post("/api/exits/newExit", body)
  return data;
}

export const getTodaysExits = async () => {
  const { data } = await axios.get<P_SAL[]>("/api/exits/todaysExits")
  return data;
}