import axios from "axios"
import base_url from "../";

export const getOneDistributionEntry = async (entryNumber: P_ENT["ENT_NUM"]) => {
  const { data } = await axios.post<P_ENT_DI>(`${base_url}/api/entries/distribution/entry`, { entryNumber })
  return data;
}