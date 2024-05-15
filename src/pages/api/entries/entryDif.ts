// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInsertAttributes } from "@/utils/api/insert";


type GET_QueryProps = {
  entryDif: Omit<P_ENT_DIF, "ENT_DIF_NUM">,
}

type POST_BodyProps = {
  entryDif: Omit<P_ENT_DIF, "ENT_DIF_NUM">,
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
    const METHOD = request.method
    if (METHOD === "GET") {

      const { entryNumber } = request.query
      // Construye la consulta SQL para obtener la diferencia de entrada por número de entrada.
      const queryString = `
        SELECT TOP 1 * FROM H025_P_ENT_DIF
        WHERE ENT_NUM = ${entryNumber}
        ORDER BY ENT_DIF_FEC DESC
      `

      // const sequelize = await getSequelize()
      // Ejecuta la consulta SQL y obtiene los resultados.
      const [data] = await sequelize.query(queryString) as [P_ENT_DIF[], unknown]

      const entryDifItem = data[0]
      if (entryDifItem) {
        
        const { ENT_DIF_NUM, ENT_NUM, ENT_DIF_FEC, ENT_PES_TAR, ENT_DI_PNC } = entryDifItem
        const { ENT_DI_PAD, ENT_DI_PPA, SAL_PES_BRU, DIF_PES } = entryDifItem
         // Construye el objeto de diferencia de entrada a partir de los resultados.
        const entryDif = {
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
        // Devuelve la respuesta HTTP con el objeto de diferencia de entrada.
        response.status(200).json(entryDif);
        
      }else{
        // Devuelve la respuesta HTTP con un objeto vacío si no se encontró la diferencia de entrada.
        response.status(200).json({
          ...data[0]
        });
      }


    } else if (METHOD === "POST") {
      // Maneja la solicitud POST para crear una nueva diferencia de entrada.

      const { entryDif }: POST_BodyProps = request.body
 
      const [keys, values] = getInsertAttributes(entryDif)
      
      //Construye la consulta sql
      const queryString = `
        INSERT H025_P_ENT_DIF\n${keys} 
        VALUES ${values}
      `

      // const sequelize = await getSequelize()
      //Ejecuta la consulta sql
      const [data] = await sequelize.query(queryString) as [unknown[], unknown]

      // Devuelve la respuesta HTTP con el resultado de la inserción.
      response.status(200).json(data);
    }

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