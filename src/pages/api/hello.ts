// EndPoint de prueba


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";

import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const query1 = `
      select * from openquery(HVEOW001,'select * from proddta.f0116 where ALAN8 in   (''27927394'',''1014665'')')
    `

    const [data] = await sequelize.query(query1) as [object[], unknown]

    response.status(200).json(Object.entries(data[0]).length);

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default testHandler;