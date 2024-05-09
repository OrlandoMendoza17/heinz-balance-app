// EndPoint de prueba


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";

import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  const transaction = await sequelize.transaction()
  try {

    const query1 = `
      UPDATE [HDTA025].[dbo].[H025_S_USU]
      SET	
        ROL_COD = '03'
      WHERE 
        USU_MAI = 'orlando.mendoza@kraftheinz.com'
    `

    const query2 = `
      UPDATE [HDTA025].[dbo].[H025_S_USU]
      SET	
        ROL_COD = '05'
      WHERE 
        USU_MA = 'alexander.rojas@kraftheinz.com'
    `
    
    await sequelize.query(query1) as [unknown[], unknown]
    await sequelize.query(query2) as [unknown[], unknown]

    await transaction.commit()
    
    response.status(200).json({});

  } catch (error) {
    await transaction.rollback();
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default testHandler;