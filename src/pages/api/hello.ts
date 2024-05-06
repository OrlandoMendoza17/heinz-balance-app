// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const queryString = `
      SELECT TOP 1000 * FROM [HDTA025].[dbo].[H025_VW_ENT_NOTA_SAL]
    `

    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [unknown[], unknown]

    response.status(200).json(data);

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default testHandler;