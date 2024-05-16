// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInsertAttributes } from "@/utils/api/insert";

type BodyProps = {
  email: S_USU["USU_MAI"],
}

const deleteUserHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const { email }: BodyProps = request.body
    
    const queryString = `
      DELETE FROM [H025_S_USU]
      WHERE USU_MAI = '${email}'
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

export default deleteUserHandler;