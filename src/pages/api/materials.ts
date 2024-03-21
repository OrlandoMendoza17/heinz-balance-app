// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";

type ModelTypes = {
  Modelo: string,
  Tipo: string,
}

const modelsHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    
    const queryString = `SELECT * FROM [HDTA025].[dbo].[H025_T_MAT]`
    
    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [T_MAT[], unknown]

    response.json(data)

  } catch (error) {
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    })
  }
}

export default modelsHandler;