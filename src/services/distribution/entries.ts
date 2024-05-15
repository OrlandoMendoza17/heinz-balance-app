import axios from "axios"
import base_url from "../";
/**
 * Función asíncrona que obtiene una entrada de distribución específica por su número de entrada.
 * 
 * @param {P_ENT["ENT_NUM"]} entryNumber - Número de entrada que se va a buscar.
 * @returns {Promise<P_ENT_DI>} Promesa que se resuelve con la entrada de distribución encontrada.
 */

export const getOneDistributionEntry = async (entryNumber: P_ENT["ENT_NUM"]) => {
  //Se utiliza la biblioteca Axios para realizar una solicitud HTTP POST a la API.
  //La solicitud se envía a la ruta `/api/entries/distribution/entry` con el número de entrada como parámetro.
  //base_url -> URL base de la API.
  //entryNumber-> Número de entrada que se va a buscar.
  const { data } = await axios.post<P_ENT_DI>(`${base_url}/api/entries/distribution/entry`, { entryNumber })

  //Se devuelve la entrada de distribución encontrada en la respuesta de la API.
  return data;
}