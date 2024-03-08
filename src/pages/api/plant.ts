import getSequelize from "@/lib/mssql"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

type BodyProps = {
  table: "OPERATION" | "DESTINATION",
}

const plantHandler = async (request: NextApiRequest, response: NextApiResponse) => {

  const method = request.method
  const { table }: BodyProps = request.body
  
  try {
    if (method === "POST") {
      
      const OPERATION = "H025_T_OPE"
      const DESTINATION = "H025_T_DES"
      
      const queryString1 = `SELECT * FROM [HDTA025].[dbo].[${OPERATION}]`
      const queryString2 = `SELECT * FROM [HDTA025].[dbo].[${DESTINATION}]`
      
      const sequelize = await getSequelize()
      
      if(table === "OPERATION"){
        console.log("table: ", table)
        const [data] = await sequelize.query(queryString1) as [T_OPE[], unknown]
        response.json(data)
      }
      
      if(table === "DESTINATION"){
        console.log("table: ", table)
        const [data] = await sequelize.query(queryString2) as [T_DES[], unknown]
        response.json(data)
      }

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