import getSequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";

type ModelTypes = {
  Modelo: string,
  Tipo: string,
}

const modelsHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const sequelize = await getSequelize()

    const queryString = `SELECT * FROM [HDTA025].[dbo].[H025_VW_VEH_MOD_COMBO]`
    const [data] = await sequelize.query(queryString) as [ModelTypes[], unknown]

    const models = [...new Set(data.map(({ Modelo }) => Modelo))]
    const types = [...new Set(data.map(({ Tipo }) => Tipo))]

    response.json({ models, types })

  } catch (error) {
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    })
  }
}

export default modelsHandler;