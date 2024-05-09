// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  userRolID: S_USU["ROL_COD"]
}

const rolsHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const { userRolID }: BodyProps = request.body

    const queryString = `
      SELECT * FROM [HDTA025].[dbo].[H025_S_ROL]
      WHERE ROL_COD = '${userRolID}'
    `

    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [S_ROL[], unknown]

    response.status(200).json(data[0]);

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default rolsHandler;