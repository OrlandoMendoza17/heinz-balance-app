// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUPDATEValues } from "@/utils/api/update";

export type UpdateUserBody = {
  email: string,
  userInfo: User,
}

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const { email, userInfo }: UpdateUserBody = request.body

    const DB_USER: S_USU = {
      USU_NOM: userInfo.nombre,
      USU_MAI: userInfo.email,
      USU_FIC: userInfo.ficha,
      USU_CED: userInfo.cedula,
      ROL_COD: userInfo.rol,
      USU_LOG: userInfo.accountName,
      USU_STA: userInfo.status,
      USU_CLA: null,
    }
    
    const values = getUPDATEValues(DB_USER)

    const queryString = `
      UPDATE H025_S_USU
      SET	
        ${values}
      WHERE 
        USU_MAI = '${email}'
    `
    
    // console.log(queryString)
    await sequelize.query(queryString) as [unknown[], unknown]

    response.status(200).json({
      message: "Succesfully updated"
    });

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default testHandler;