// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";

const densityHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    
    const queryString = `SELECT * FROM [HDTA025].[dbo].[H025_T_DEN]`
    
    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [T_DEN[], unknown]

    response.json(data)

  } catch (error) {
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    })
  }
}

export default densityHandler;