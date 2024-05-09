// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInsertAttributes } from "@/utils/api/insert";

type BodyProps = {
  user: User,
}

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const { user }: BodyProps = request.body
 
    const [keys, values] = getInsertAttributes(user)
    
    const queryString = `
      INSERT H025_T_CON\n${keys} 
      VALUES ${values}
    `
    
    await sequelize.query(queryString) as [unknown[], unknown]

    response.status(200).json({});

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default testHandler;