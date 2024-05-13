import axios from "axios"
import { DESTINATIONS } from "@/pages/api/destinations";
import base_url from ".";
/**
 * Obtiene una lista de destinos desde el servidor.
 * @returns {Promise<DESTINATIONS[]>} - Un array de objetos de destino.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const getDestination = async () => {
   // Realiza una solicitud POST al servidor para obtener la lista de destinos
  const { data } = await axios.post<DESTINATIONS[]>(`${base_url}/api/destinations`)

  // Devuelve los datos obtenidos
  return data;
}