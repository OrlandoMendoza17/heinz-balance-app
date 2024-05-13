import axios from "axios"
import base_url from ".";
/**
 * Obtiene una lista de materiales desde la API.
 *
 * @returns {Promise<T_MAT[]>} - Promesa que se resuelve con una lista de materiales.
 */
export const getMaterials = async () => {
  // Realiza una petición POST a la API para obtener la lista de materiales
  const { data } = await axios.post<T_MAT[]>(`${base_url}/api/materials`)
  // Devuelve la lista de materiales obtenida desde la API
  return data;
}