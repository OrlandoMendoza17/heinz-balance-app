// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";

type ModelTypes = {
  Modelo: string,
  Tipo: string,
}

export type ModelTypesOptions = {
  models: string[];
  types: string[];
}

const modelsHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    // const sequelize = await getSequelize()

    const queryString = `SELECT * FROM [HDTA025].[dbo].[H025_VW_VEH_MOD_COMBO]`
    const [data] = await sequelize.query(queryString) as [ModelTypes[], unknown]

    const models = [...new Set(data.map(({ Modelo }) => Modelo))]
    const types = [...new Set(data.map(({ Tipo }) => Tipo))]

    const modelTypes: ModelTypesOptions = { models, types }
    
    response.json(modelTypes)

  } catch (error) {
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    })
  }
}

export default modelsHandler;