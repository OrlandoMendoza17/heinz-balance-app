// const getSQLValue = (value: string | number | boolean | null) => {
//   return (
//     (typeof value === "string") ? `'${value}'` : (
//       (value === null) ? JSON.stringify(value) : (
//         (typeof value === "boolean") ? (value ? 1 : 0) :
//           value
//       )
//     )
//   )
// }

export const getSQLValue = (value: string | number | boolean | null) => {

  if (typeof value === "string") {
    value = `'${value}'`
  }
  if (typeof value === "boolean") {
    value = value ? 1 : 0
  }
  if (value === null) {
    value = JSON.stringify(value)
  }

  return value;
}

// Creamos una cadena con las claves del objeto vehicule, rodeadas de corchetes
/**
 * 
 * @param {object} object Esto es un objeto cualquiera (No incluye Arrays)
 * @returns Devuelve un string con los KEYS o FIELDS del objeto para usarlos en una consulta SQL de tipo INSERT
 */
export const getInsertKeys = (object: object) =>{
  return `(${Object.keys(object).map(key => `[${key}]`).join(", ")})`
}

// Creamos una cadena con los valores del objeto vehicule, convirtiéndolos a formato SQL
/**
 * 
 * @param {object} object Esto es un objeto cualquiera (No incluye Arrays)
 * @returns Devuelve un string con los VALUES del objeto para usarlos en una consulta SQL de tipo INSERT
 */
export const getInsertValues = (object: object) =>{
  return `(${Object.values(object).map(value => getSQLValue(value)).join(", ")})`
}

export const getInsertAttributes = (object: object) => {
  const keys = getInsertKeys(object)
  const values = getInsertValues(object)
  
  return [keys, values]
}