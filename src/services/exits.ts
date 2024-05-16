import axios from "axios";
import { NewExitParamsBodyProps } from "@/pages/api/exits/newExit";
import { GetExitsBodyProps } from "@/pages/api/exits";
import base_url from ".";

type NewExitParams = NewExitParamsBodyProps
/**
 * Crea una nueva salida en el sistema.
 * @param {NewExitParams} body - Parámetros para crear una nueva salida.
 */
export const createNewExit = async (body: NewExitParams) => {
  await axios.post(`${base_url}/api/exits/newExit`, body)
}
/**
 * Obtiene una lista de salidas según los parámetros proporcionados.
 *
 * @param {GetExitsBodyProps} body - Parámetros para filtrar las salidas.
 * @returns {Promise<Exit[]>} - Promesa que se resuelve con una lista de salidas.
 */
export const getExits = async (body: GetExitsBodyProps) => {
  // Realiza una petición POST a la API para obtener las salidas
  // con los parámetros proporcionados en el objeto `body`.
  let { data: exits } = await axios.post<Exit[]>(`${base_url}/api/exits`, body)
  // Procesa cada salida para formatear las fechas de entrada y salida
  exits = exits.map(({ exitDate, entryDate, ...rest }) => (
    {
      ...rest,
      // Reemplaza "T" con un espacio y "Z" con una cadena vacía para formatear la fecha
      entryDate: entryDate.replace("T", " ").replace("Z", ""),
      exitDate: exitDate.replace("T", " ").replace("Z", ""),
    }
  ))
  // Devuelve la lista de salidas procesadas.
  return exits;
}