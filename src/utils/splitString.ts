/**
 * Función que divide una cadena de texto en trozos de un tamaño determinado y devuelve una cadena con cada trozo en una línea separada.
 * @param {string} entryDetails - La cadena de texto que se va a dividir.
 * @returns {string} Una cadena con cada trozo de la cadena original en una línea separada.
 */
export const splitString = (entryDetails: string) => {
  
  //Variable que almacenará la cadena resultante con cada trozo en una línea separada.
  let details = ""
  //Longitud del trozo (chunk) que se va a utilizar para dividir la cadena.
  const chunkLength = 40
  //Cálculo del número de trozos que se necesitan para dividir la cadena completa.
  const limit = Math.ceil(entryDetails.length / chunkLength)
  // Bucle que itera sobre cada trozo de la cadena y lo agrega a la variable `details`.
  for (let index = 0; index < limit; index++) {
    // Se extrae un trozo de la cadena original utilizando el método `slice`.
    // Se utiliza `trim()` para eliminar cualquier espacio en blanco adicional.
    details += `${`${entryDetails.slice(chunkLength * index, (chunkLength * index) + chunkLength)}`.trim()}\n`
  }
  //Se devuelve la cadena resultante con cada trozo en una línea separada.
  return details;
}