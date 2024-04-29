import axios from "axios"
import base_url from ".";

export const getMaterials = async () => {
  const { data } = await axios.post<T_MAT[]>(`${base_url}/api/materials`)
  return data;
}