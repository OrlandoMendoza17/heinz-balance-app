import axios from "axios"
import { NewEntry } from "@/utils/getTableValues"
import base_url from "."

/**
 * Parámetros para crear una nueva entrada.
 *
 * @property {NewEntry} entry - Información de la entrada que se está creando.
 * @property {object} entryByDestination - Información adicional para la entrada por destino.
 */
type NewEntryParams = {
  entry: NewEntry,
  entryByDestination: object,
}

export type EntriesType = "entry" | "initial" | "dispatch" | "aboutToLeave" | "all"

/**
 * Obtiene una entrada específica según su número de entrada.
 *
 * @param {P_ENT["ENT_NUM"]} entryNumber - Número de entrada a buscar.
 * @returns {Promise<P_ENT>} - Promesa que se resuelve con la entrada encontrada.
 */
export const getEntry = async (entryNumber: P_ENT["ENT_NUM"]) => {
  // Realiza una petición POST a la API para obtener la entrada
  const { data } = await axios.post<P_ENT[]>(`${base_url}/api/entries`, { entries: [entryNumber] })
  // Devuelve la primera entrada encontrada (o undefined si no se encontró
  return data[0];
}

/**
 * Crea una nueva diferencia de entrada en la API.
 *
 * @param {Omit<P_ENT_DIF, "ENT_DIF_NUM">} entryDif - Información de la diferencia de entrada a crear.
 * @returns {Promise<any>} - Promesa que se resuelve con los datos de la diferencia de entrada creada.
 */
export const createNewEntryDifference = async (entryDif: Omit<P_ENT_DIF, "ENT_DIF_NUM">) => {
  // Realiza una petición POST a la API para crear la diferencia de entrada
  const { data } = await axios.post(`${base_url}/api/entries/entryDif`, { entryDif })
  // Devuelve los datos de la diferencia de entrada creada
  return data;
}

/**
 * Obtiene la diferencia de entrada asociada a un número de entrada específico.
 *
 * @param {P_ENT_DI["ENT_NUM"]} entryNumber - Número de entrada para buscar la diferencia de entrada.
 * @returns {Promise<EntryDif>} - Promesa que se resuelve con la diferencia de entrada encontrada.
 */
export const getEntryDifference = async (entryNumber: P_ENT_DI["ENT_NUM"]) => {
  // Realiza una petición GET a la API para obtener la diferencia de entrada
  const { data } = await axios.get<EntryDif>(`${base_url}/api/entries/entryDif`, { params: { entryNumber } })
  // Devuelve la diferencia de entrada encontrada
  return data;
}

/**
 * Crea una nueva entrada en la API.
 *
 * @param {NewEntryParams} body - Parámetros para crear la nueva entrada.
 * @returns {Promise<any>} - Promesa que se resuelve con los datos de la entrada creada.
 */
export const createNewEntry = async (body: NewEntryParams) => {
  // Realiza una petición POST a la API para crear la nueva entrada
  const { data } = await axios.post(`${base_url}/api/entries/newEntry`, body)
  // Devuelve los datos de la entrada creada
  return data;
}

/**
 * Actualiza una entrada existente en la API.
 *
 * @param {P_ENT["ENT_NUM"]} entryNumber - Número de entrada a actualizar.
 * @param {UpdateP_ENT} entry - Información de la entrada actualizada.
 * @returns {Promise<{ message: string }>} - Promesa que se resuelve con un mensaje de confirmación de la actualización.
 */
export const updateEntry = async (entryNumber: P_ENT["ENT_NUM"], entry: UpdateP_ENT) => {
  // Realiza una petición POST a la API para actualizar la entrada
  const { data } = await axios.post<{ message: string }>(`${base_url}/api/entries/updateEntry`, { entryNumber, entry })
  // Devuelve el mensaje de confirmación de la actualización
  return data;
}

/**
 * Obtiene una lista de entradas en la planta desde la API.
 *
 * @returns {Promise<Exit[]>} - Promesa que se resuelve con una lista de entradas en la planta.
 */
export const getEntriesInPlant = async () => {
  // Realiza una petición GET a la API para obtener las entradas en la planta
  let { data: exits } = await axios.get<Exit[]>(`${base_url}/api/entries/inPlant`)
  // Procesa cada entrada para formatear la fecha de entrada
  exits = exits.map(({ entryDate, ...rest }) => (
    {
      ...rest,
      entryDate: entryDate.replace("T", " ").replace("Z", "")
    }
  ))
  // Devuelve la lista de entradas en la planta
  return exits;
}

/**
 * Obtiene el próximo número de entrada desde la API.
 *
 * @returns {Promise<P_ENT["ENT_NUM"]>} - Promesa que se resuelve con el próximo número de entrada.
 */
export const getNextEntryNumber = async () => {
   // Realiza una solicitud GET a la URL para obtener el próximo número de entrada
  const { data } = await axios.get<{ nextEntryNumber: P_ENT["ENT_NUM"] }>(`${base_url}/api/entries/nextEntry`)
  // Regresa el ultimo numero de entrada + 1
  return data.nextEntryNumber;
}

/**
 * Obtiene una lista de entradas distribuidas según el tipo especificado desde la API.
 *
 * @param {EntriesType} entriesType - El tipo de entradas a obtener (por ejemplo, "in" o "out").
 * @returns {Promise<P_ENT_DI[]>} - Promesa que se resuelve con una lista de entradas distribuidas.
 */
export const getDistEntries = async (entriesType: EntriesType) => {
  // Realiza una solicitud POST a la URL para obtener las entradas distribuidas
  const { data } = await axios.post<P_ENT_DI[]>(`${base_url}/api/entries/distribution`, { entriesType, formatted: false })
  // Devuelve la lista de entradas distribuidas
  return data;
}

/**
 * Obtiene una lista de entradas de distribución formateadas desde la API.
 * 
 * @param {EntriesType} entriesType - El tipo de entradas que se van a recuperar.
 * @returns {Promise<DistributionEntry[]>} - Una promesa que se resuelve en un arreglo de entradas de distribución formateadas.
 */
export const getFormattedDistEntries = async (entriesType: EntriesType) => {
  
    // Envía una solicitud POST a la API para recuperar las entradas de distribución.
    // El cuerpo de la solicitud incluye el tipo de entradas y una bandera para indicar que las entradas deben estar formateadas.
  let { data: entries } = await axios.post<DistributionEntry[]>(`${base_url}/api/entries/distribution`, { entriesType, formatted: true })
  
  // Transforma las entradas modificando el campo entryDate para reemplazar los caracteres 'T' y 'Z' con un espacio y una cadena vacía, respectivamente.
  // Esto se hace para formatear la cadena de fecha en una forma más legible.
  entries = entries.map(({ entryDate, ...rest }) => (
    {
      ...rest,
      entryDate: entryDate.replace("T", " ").replace("Z", "")
    }
  ))
  //Devuelve las entradas transformadas.
  return entries;
}

/**
 * Actualiza una entrada de distribución en la API.
 * 
 * @param {P_ENT_DI} distEntry - La entrada de distribución que se va a actualizar.
 * @returns {Promise<{ message: string }>} - Una promesa que se resuelve con un objeto que contiene un mensaje de respuesta.
 */
export const updateDistEntry = async (distEntry: P_ENT_DI) => {
  // Envía una solicitud POST a la API para actualizar la entrada de distribución.
  // El cuerpo de la solicitud incluye la entrada de distribución que se va a actualizar.
  const { data } = await axios.post<{ message: string }>("/api/entries/updateDistEntry", { distEntry })
  // Devuelve el objeto de respuesta que contiene el mensaje de resultado.
  return data;
}