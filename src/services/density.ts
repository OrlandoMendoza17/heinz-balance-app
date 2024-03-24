import axios from "axios"

export const getDensity = async () => {
  const { data } = await axios.post<T_DEN[]>("/api/density")
  return data;
}