// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSQLValue } from "../exits/newExit";

type GET_QueryProps = {
  entryDif: Omit<P_ENT_DIF, "ENT_DIF_NUM">,
}

type POST_BodyProps = {
  entryDif: Omit<P_ENT_DIF, "ENT_DIF_NUM">,
}

const entryDifferencesHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    const METHOD = request.method
    if (METHOD === "GET") {

      const { entryNumber } = request.query

      const queryString = `
        SELECT TOP 1 * FROM H025_P_ENT_DIF
        WHERE ENT_NUM = ${entryNumber}
        ORDER BY ENT_DIF_FEC DESC
      `

      // const sequelize = await getSequelize()
      const [data] = await sequelize.query(queryString) as [P_ENT_DIF[], unknown]

      const entryDifItem = data[0]
      if (entryDifItem) {
        
        const { ENT_DIF_NUM, ENT_NUM, ENT_DIF_FEC, ENT_PES_TAR, ENT_DI_PNC } = entryDifItem
        const { ENT_DI_PAD, ENT_DI_PPA, SAL_PES_BRU, DIF_PES } = entryDifItem
        
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
        
        response.status(200).json(entryDif);
        
      }else{
        response.status(200).json({
          ...data[0]
        });
      }


    } else if (METHOD === "POST") {

      const { entryDif }: POST_BodyProps = request.body

      const keys = `(${Object.keys(entryDif).map(key => `[${key}]`).join(", ")})`
      const values = `(${Object.values(entryDif).map(value => getSQLValue(value)).join(", ")})`

      const queryString = `
        INSERT H025_P_ENT_DIF\n${keys} 
        VALUES ${values}
      `

      // const sequelize = await getSequelize()
      const [data] = await sequelize.query(queryString) as [unknown[], unknown]

      response.status(200).json(data);
    }

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default entryDifferencesHandler;