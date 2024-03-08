import axios from "axios"

export const getOperation = async () => {
  const { data } = await axios.post<T_OPE[]>("/api/plant", { table: "OPERATION" })
  return data;
}

export const getDestination = async () => {
  const { data } = await axios.post<T_DES[]>("/api/plant", { table: "DESTINATION" })
  return data;
}
