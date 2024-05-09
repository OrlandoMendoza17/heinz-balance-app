//Settear cookies
/**
 * Establece una cookie en el navegador con el nombre y valor especificados.
 * 
 * @param {string} name - El nombre de la cookie.
 * @param {unknown} value - El valor de la cookie. Puede ser cualquier tipo de dato.
 * @param {number} days - El número de días que la cookie debe permanecer válida. Si no se proporciona, la cookie será una cookie de sesión.
 */
export const setCookie = (name: string, value: unknown, days: number) => {
  // Inicializamos la cadena de expires vacía
  let expires = "";
  // Si se proporcionó un número de días, creamos la fecha de expiración
  if (days) {
    // Creamos una fecha actual
    const date = new Date();
     // Añadimos el número de días especificado a la fecha actual
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
     // Convertimos la fecha a una cadena en formato UTC
    expires = "; expires=" + date.toUTCString();
  }
  // Creamos la cadena de cookie completa
  document.cookie = name + "=" + (JSON.stringify(value) || "") + expires + "; path=/";
}


/**
 * Obtiene el valor de una cookie con el nombre especificado.
 * 
 * @param {string} name - El nombre de la cookie que se quiere obtener.
 * @returns {T | null} - El valor de la cookie si existe, o null si no existe.
 */
export const getCookie = <T,>(name: string): T | null => {
  // Creamos una cadena que contiene el nombre de la cookie seguido de "="
  const nameEQ = name + "=";
   // Separamos la cadena de cookies en un array de cookies individuales
  const ca = document.cookie.split(';');
  // Iteramos sobre el array de cookies
  for (var i = 0; i < ca.length; i++) {
    // Obtenemos la cookie actual
    let c = ca[i];
    // Eliminamos los espacios en blanco al principio de la cookie
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
     // Verificamos si la cookie actual es la que estamos buscando
    if (c.indexOf(nameEQ) == 0) 
      // Si es la cookie que estamos buscando, la parseamos como JSON y la devolvemos
      return JSON.parse(c.substring(nameEQ.length, c.length));
  }
   // Si no se encontró la cookie, devolvemos null
  return null;
}

/**
 * Elimina una cookie con el nombre especificado.
 * 
 * @param {string} name - El nombre de la cookie que se quiere eliminar.
 */
export const eraseCookie = (name: string) => {
  // Creamos una cadena que establece la cookie con el nombre especificado a una cadena vacía
  // y establece la fecha de expiración en una fecha pasada (01 de enero de 1970) para que la cookie sea eliminada
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}