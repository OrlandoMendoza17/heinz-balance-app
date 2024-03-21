import axios from "axios"

export const getMaterials = async () => {
  const { data } = await axios.post<T_MAT[]>("/api/materials")
  return data;
}