import axios from "axios"
import base_url from ".";

export const getDensity = async () => {
  const { data } = await axios.post<T_DEN[]>(`${base_url}/api/density`)
  return data;
}