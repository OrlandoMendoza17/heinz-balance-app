// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  name: string,
}

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    const { name }: BodyProps = request.body

    const queryString = `
      SELECT * FROM [HDTA025].[dbo].[H025_T_TRA]
      WHERE TRA_NOM LIKE '%${name.toUpperCase()}%'
    `

    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [T_TRA[], unknown]

    const transports: Transport[] = data.map((transport) => {
      return {
        name: transport["TRA_NOM"],
        RIF: transport["TRA_RIF"],
        code: transport["TRA_COD"],
      }
    })

    response.status(200).json(transports);

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default testHandler;