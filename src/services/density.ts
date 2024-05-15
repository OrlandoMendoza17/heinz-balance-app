import axios from "axios"
import base_url from ".";

/**
 * Función que obtiene la densidad de los datos.
 * @returns {Promise<T_DEN[]>} Promesa que se resuelve con un array de objetos T_DEN que representan la densidad de los datos.
 */
export const getDensity = async () => {
  // Se utiliza la biblioteca Axios para realizar una solicitud HTTP POST a la API de densidad.
  // La solicitud se envía a la ruta `/api/density` sin parámetros en el cuerpo de la solicitud.
  const { data } = await axios.post<T_DEN[]>(`${base_url}/api/density`)
  // Se devuelve el array de objetos T_DEN que representan la densidad de los datos, obtenido en la respuesta de la API.
  return data;
}