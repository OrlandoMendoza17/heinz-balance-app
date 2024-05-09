import axios from "axios"
import base_url from "."
import { UpdateUserBody } from "@/pages/api/users/update"

export const getUsers = async (email: string = "") => {
  const { data } = await axios.post<User[]>(`${base_url}/api/users`, { email })
  return email ? data[0] : data
}

export const updateUser = async (body: UpdateUserBody) => {
  await axios.post(`${base_url}/api/users/update`, body)
}

export const getRol = async (userRolID: S_USU["ROL_COD"]) => {
  const { data } = await axios.post<S_ROL>(`${base_url}/api/users/rols`, { userRolID })
  return data.ROL_DES
}

