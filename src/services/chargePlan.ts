import axios from "axios"

export const getChargePlan = async (chargePlan: string) => {
  const { data } = await axios.post<ChargePlanInfo>("/api/chargePlan", { chargePlan: parseInt(chargePlan) })
  return data;
}