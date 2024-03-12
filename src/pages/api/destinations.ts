import getSequelize from "@/lib/mssql"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

type BodyProps = {
  table: "OPERATION" | "DESTINATION",
}

export type DESTINATIONS = Pick<T_DES & T_OPE, "DES_COD" | "OPE_COD" | "DES_DES">

const plantHandler = async (request: NextApiRequest, response: NextApiResponse) => {

  const method = request.method
  const { table }: BodyProps = request.body

  try {
    if (method === "POST") {

      const queryString = `
        SELECT H025_T_DES.DES_COD, H025_T_OPE.OPE_COD, H025_T_DES.DES_DES
        FROM [HDTA025].[dbo].H025_T_DES
        INNER JOIN [HDTA025].[dbo].H025_T_OPE ON H025_T_DES.DES_COD = H025_T_OPE.DES_COD
        ORDER BY DES_COD ASC;
      `
      
      const sequelize = await getSequelize()

      const [data] = await sequelize.query(queryString) as [DESTINATIONS[], unknown]
      response.json(data)

    } else {

      throw new Error("Wrong request")

    }

  } catch (error) {
    response.status(500).json({
      status: 500,
      error,
    })
  }
}

export default plantHandler;