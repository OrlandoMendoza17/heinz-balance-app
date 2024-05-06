import axios from "axios"
import base_url from ".";

export const getChargePlan = async (chargePlan: string) => {
  const { data } = await axios.post<ChargePlanInfo>(`${base_url}/api/chargePlan`, { chargePlan: parseInt(chargePlan) })
  return data;
}