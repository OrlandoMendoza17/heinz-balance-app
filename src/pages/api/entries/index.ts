// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  entries: P_ENT["ENT_NUM"][];
};

const entriesHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const { entries }: BodyProps = request.body

    const queryString = `
      SELECT * FROM H025_P_ENT
      WHERE ENT_NUM IN (${entries})
      ORDER BY ENT_NUM DESC
    `

    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [P_ENT[], unknown]

    response.status(200).json(data);

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default entriesHandler;