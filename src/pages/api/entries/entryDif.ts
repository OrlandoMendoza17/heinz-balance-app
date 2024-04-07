// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSQLValue } from "../exits/newExit";

type BodyProps = {
  entryDif: Omit<P_ENT_DIF, "ENT_DIF_NUM">,
}

const entryDifferencesHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    const { entryDif }: BodyProps = request.body

    const keys = `(${Object.keys(entryDif).map(key => `[${key}]`).join(", ")})`
    const values = `(${Object.values(entryDif).map(value => getSQLValue(value)).join(", ")})`

    const queryString = `
      INSERT H025_T_CON\n${keys} 
      VALUES ${values}
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

export default entryDifferencesHandler;