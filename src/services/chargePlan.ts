import axios from "axios"
import base_url from ".";
/**
 * Función que obtiene la información del plan de carga según el parámetro proporcionado.
 * @param {string} chargePlan - Identificador del plan de carga que se va a obtener.
 * @returns {Promise<ChargePlanInfo>} Promesa que se resuelve con la información del plan de carga.
 */
export const getChargePlan = async (chargePlan: string) => {

  // Se utiliza la biblioteca Axios para realizar una solicitud HTTP POST a la API de charge plan.
  // La solicitud se envía a la ruta `/api/chargePlan` con el identificador del plan de carga en el cuerpo de la solicitud.
  // Se utiliza `parseInt` para convertir el parámetro `chargePlan` a un número entero.
  const { data } = await axios.post<ChargePlanInfo>(`${base_url}/api/chargePlan`, { chargePlan: parseInt(chargePlan) })
  
  //Se devuelve la información del plan de carga obtenida en la respuesta de la API.
  return data;
}