import axios from "axios"
import base_url from "."
import { UpdateUserBody } from "@/pages/api/users/update"
import { SearchUserBy } from "@/pages/api/users"

/**
 * Obtiene una lista de usuarios desde la API, opcionalmente filtrada por correo electrónico.
 *
 * @param {string} [email=""] - Correo electrónico del usuario a buscar (opcional).
 * @returns {Promise<User | User[]>} - Promesa que se resuelve con un usuario o una lista de usuarios.
 */
export const getUsers = async (searchBy: SearchUserBy) => {
  const { data } = await axios.post<User[]>(`${base_url}/api/users`, searchBy)
  return data;
}

export const createUser = async (user: User) => {
  await axios.post(`${base_url}/api/users/create`, { user })
}

/**
 * Actualiza un usuario en la API con los datos proporcionados.
 *
 * @param {UpdateUserBody} body - Datos del usuario a actualizar.
 * @returns {Promise<void>} - Promesa que se resuelve cuando la actualización se completa.
 */
export const updateUser = async (body: UpdateUserBody) => {
  // Realiza una petición POST a la API para actualizar el usuario
  await axios.post(`${base_url}/api/users/update`, body)
}

export const deleteUser = async (email: S_USU["USU_MAI"]) => {
  // Realiza una petición POST a la API para actualizar el usuario
  await axios.post(`${base_url}/api/users/delete`, { email })
}

/**
 * Obtiene la descripción del rol asociado a un usuario según su ID de rol.
 *
 * @param {S_USU["ROL_COD"]} userRolID - ID del rol del usuario.
 * @returns {S_ROL | S_ROL[]} - Promesa que se resuelve con la descripción del rol.
 */
export const getRols = async (userRolID: S_USU["ROL_COD"] = "") => {
  const { data } = await axios.post<S_ROL[]>(`${base_url}/api/users/rols`, { userRolID })
  return userRolID ? data[0] : data
}