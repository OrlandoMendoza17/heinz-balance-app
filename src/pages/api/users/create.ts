// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInsertAttributes } from "@/utils/api/insert";

type BodyProps = {
  user: User,
}

const createUserHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const { user }: BodyProps = request.body
    
    const DB_USER: S_USU = {
      USU_NOM: user.nombre,
      USU_MAI: user.email,
      USU_FIC: user.ficha,
      USU_CED: user.cedula,
      ROL_COD: user.rol,
      USU_LOG: user.accountName,
      USU_STA: user.status,
      USU_CLA: null,
    }
    
    const [keys, values] = getInsertAttributes(DB_USER)
    
    const queryString = `
      INSERT H025_S_USU\n${keys} 
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

export default createUserHandler;