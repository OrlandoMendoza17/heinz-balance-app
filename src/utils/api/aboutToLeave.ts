import { DESTINATION_TABLES } from "@/lib/enums"

/**
 * Devuelve una consulta SQL para buscar la entrada correspondiente a un destino específico en la base de datos.
 * 
 * @param {DES_COD} destinationCode Código de destino (DES_COD) que se utiliza para determinar la tabla de destino.
 * @param {P_ENT["ENT_NUM"]} ENT_NUM Número de entrada (ENT_NUM) que se busca en la tabla de destino.
 * @returns {string} Consulta SQL para buscar la entrada correspondiente al destino
 */

const getDestinationEntryQuery = (destinationCode: DES_COD, ENT_NUM: P_ENT["ENT_NUM"]) => {
  //Crea la consulta en base a los parametros
  const queryString = `
    SELECT * FROM [HDTA025].[dbo].[H025_P_${DESTINATION_TABLES[destinationCode]}] 
    WHERE ENT_NUM IN (${ENT_NUM})
  `
  //retorna la consulta
  return queryString
}

export default getDestinationEntryQuery;