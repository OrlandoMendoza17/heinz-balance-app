export type TargetProps = EventTarget & HTMLElement
/**
 * Obtiene el valor de un atributo de datos (data-attribute) de un elemento y lo devuelve como un booleano.
 * 
 * @param {TargetProps} target - El elemento que contiene el atributo de datos.
 * @param {string} attribute - El nombre del atributo de datos que se quiere obtener.
 * @returns {boolean} - El valor del atributo de datos como un booleano, o false si no existe.
 */
const getDataAttribute = (target: TargetProps, attribute: string): boolean => {
  // Obtenemos el valor del atributo de datos con el nombre especificado
  const dataModal = (target.dataset[attribute] as (string | undefined))
  // Verificamos si el valor del atributo de datos existe y no es undefined
  // Si existe, lo parseamos como un JSON y lo devolvemos como un booleano
  // Si no existe, devolvemos false
  return (dataModal !== undefined) ? Boolean(JSON.parse(dataModal)) : false;
}

export default getDataAttribute;