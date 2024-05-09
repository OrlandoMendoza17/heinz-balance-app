import { addHours, format } from "date-fns"
import { es } from "date-fns/locale"

export const TODAY = new Date()
/**
 * Esta funcion no hace nada 
 * @param date fecha
 */
export const reformatDateFromDB = (date: string) =>{
  
}

/**
 * Convierte una fecha en formato de cadena o número a una fecha corta en formato "dd/MM/yyyy".
 * 
 * @param {string | number} date - La fecha que se quiere convertir.
 * @returns {string} - La fecha en formato "dd/MM/yyyy" si se proporcionó una fecha válida, o una cadena vacía si no se proporcionó una fecha.
 */
export const shortDate = (date: string | number) => {
  // En caso de que se proporcione undefined, se retorna "N/A"
  // debugger
  if (date) {
    // Creamos una fecha a partir de la fecha proporcionada
    return format(new Date(date), "dd/MM/yyyy")
    // Utilizamos la función format para convertir la fecha a formato "dd/MM/yyyy"
  }
  // Si no se proporcionó una fecha, se retorna una cadena vacía
  return '';
// Ejemplo de entrada: '2020-10-14T19:29:31Z'
// Ejemplo de salida: '14/10/2020'
}

/**
 * Formatea una fecha y hora en un string corto en formato "hh:mm:ss aaaa".
 * 
 * @param {string | number} date - La fecha y hora que se quiere formatear. Puede ser una cadena en formato de fecha o un número que represente la fecha en milisegundos.
 * @returns {string} - La fecha y hora formateada en hh:mm:ss aaaa.
 */
export const shortTime = (date: string | number) => {
  // En caso de que no se proporcione una fecha, se devuelve "N/A"
  debugger
  if (date) {
    // Formateamos la fecha y hora en un string corto en formato "hh:mm:ss aaaa"
    return format(new Date(date), "hh:mm:ss aaaa")
  }

  return '';
}
/**
 * Convierte una fecha en formato de cadena a una fecha en formato legible y amigable.
 * @param {string} date - La fecha en formato de cadena que se quiere convertir.
 * @returns {string} - La fecha en formato -> dd/MM/yyyy, hh:mm:ss aaaa
 */
export const getCuteFullDate = (date: string) => {
  // console.log('date', date)
  // return date ? new Date(date).toLocaleString("es-VE") : ""
  // return date ? format(addHours(new Date(date), 4), "dd/MM/yyyy, hh:mm:ss aaaa") : ""
  return date ? format(new Date(date), "dd/MM/yyyy, hh:mm:ss aaaa") : ""
}
/**
 * Convierte una fecha en formato de cadena a una fecha en formato legible y amigable.
 * @param {string} date - La fecha en formato de cadena que se quiere convertir.
 * @returns {string} - La fecha en formato -> yyyy-MM-dd HH:mm:ss.SSS
 */
export const getDateTime = (dateString?: string) => {
  const DATE = dateString ? new Date(dateString) : new Date()
  return format(new Date(DATE), "yyyy-MM-dd HH:mm:ss.SSS")
}
/**
 * Convierte una fecha en formato de cadena a una fecha en formato legible y amigable.
 * @param {string} date - La fecha en formato de cadena que se quiere convertir.
 * @returns {string} - La fecha en formato -> yyyy-MM-dd
 */
export const formatDateString = (date = TODAY): string => {
  return format(date, "yyyy-MM-dd")
}