import { getSQLValue } from "./insert";

/**
 * Convierte un objeto en una cadena de valores para una consulta de actualización SQL.
 * 
 * @param {object} object - Objeto que contiene los valores a actualizar.
 * 
 * @returns {string} Cadena de valores para la consulta de actualización SQL.
 */
export const getUPDATEValues = (object: object) => {
    /**
   * Obtiene las entradas del objeto como un arreglo de pares clave-valor.
   */
  const entries = Object.entries(object) as [string, any][]

  /**
   * Convierte cada entrada en una cadena de valor para la consulta SQL.
   */
  const values = entries.map(([key, value]) => `${key} = ${getSQLValue(value)}`).join(",\n        ")

  
  /**
   * Devuelve la cadena de valores para la consulta de actualización SQL.
   */
  return values;
}