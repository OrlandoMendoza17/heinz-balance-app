// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInsertAttributes } from "@/utils/api/insert";

export type EntryDifs_BodyProps = {
  dateFrom?: string;
  dateTo?: string;
  entryNumbers: P_ENT["ENT_NUM"][]
}

/**
 * Manejador de diferencias de entrada. Recibe una solicitud HTTP y devuelve una respuesta.
 * 
 * @param {NextApiRequest} request La solicitud HTTP.
 * @param {NextApiResponse} response La respuesta HTTP.
 */
const entryDifferencesHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    // Maneja la solicitud GET para obtener la diferencia de entrada por número de entrada.
    const { dateFrom, dateTo, entryNumbers }: EntryDifs_BodyProps = request.body

    // Construye un arreglo de opciones para la consulta.
    // Se coloca todas las opciones en un array para que todas sean opcionales, luego se coloca el WHERE y el AND
    const options = [
      dateFrom ? `ENT_DIF_FEC >= '${dateFrom}'` : "",
      dateTo ? `ENT_DIF_FEC <= '${dateTo}'` : "",
      entryNumbers.length ? `ENT_NUM IN (${entryNumbers.map(value => `'${value}'`)})` : "",
    ];

    // Construye la consulta SQL para obtener la diferencia de entrada por número de entrada.
    const queryString = `
      SELECT * FROM H025_P_ENT_DIF
      ${options.reduce((accumulator, field, index) => {
        if (field) {
          return `${accumulator} ${!accumulator.includes("WHERE") ? `WHERE ${field}` : ` AND ${field}`}`
        } else {
          return accumulator
        }
      }, "")}
      ORDER BY ENT_DIF_FEC DESC
    `

    // const sequelize = await getSequelize()
    // Ejecuta la consulta SQL y obtiene los resultados.
    const [data] = await sequelize.query(queryString) as [P_ENT_DIF[], unknown]

    const entryDifs = data.map((entryDifItem) => {

      const { ENT_DIF_NUM, ENT_NUM, ENT_DIF_FEC, ENT_PES_TAR, ENT_DI_PNC } = entryDifItem
      const { ENT_DI_PAD, ENT_DI_PPA, SAL_PES_BRU, DIF_PES } = entryDifItem
      // Construye el objeto de diferencia de entrada a partir de los resultados.

      const entryDif: EntryDif = {
        entryDifferenceNumber: ENT_DIF_NUM, // id de la diferencia 
        entryNumber: ENT_NUM,               // numero de la entrada 
        entryDifferenceDate: ENT_DIF_FEC,   // Fecha en la que ocurre la diferencia 
        truckWeight: ENT_PES_TAR,           // Tara - peso de entrada 
        calculatedNetWeight: ENT_DI_PNC,    // peso del plan de carga (verificar )
        aditionalWeight: ENT_DI_PAD,        // Peso adicional 
        palletWeight: ENT_DI_PPA,           // Peso de las paletas 
        grossWeight: SAL_PES_BRU,           // Peso bruto de la salida 
        weightDifference: DIF_PES,          // diferencia de peso 
      }

      return entryDif;
    })

    // Devuelve la respuesta HTTP con el objeto de diferencia de entrada.
    response.status(200).json(entryDifs);

  } catch (error) {
    // Devuelve la respuesta HTTP con un error en caso de fallo.
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default entryDifferencesHandler;