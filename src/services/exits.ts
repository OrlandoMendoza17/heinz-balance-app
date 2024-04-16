import axios from "axios";
import { NewExitParamsBodyProps } from "@/pages/api/exits/newExit";
import { GetExitsBodyProps } from "@/pages/api/exits";

type NewExitParams = NewExitParamsBodyProps

export const createNewExit = async (body: NewExitParams) => {
  const { data } = await axios.post("/api/exits/newExit", body)
  return data;
}

export const getExits = async (body: GetExitsBodyProps) => {
  let { data: exits } = await axios.post<Exit[]>("/api/exits", body)
  exits = exits.map(({ exitDate, entryDate, ...rest }) => (
    {
      ...rest,
      entryDate: entryDate.replace("T", " ").replace("Z", ""),
      exitDate: exitDate.replace("T", " ").replace("Z", ""),
    }
  ))
  return exits;
}