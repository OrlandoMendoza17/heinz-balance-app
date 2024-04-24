// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    
    const queryString = `
      SELECT ABAN8, ABTAXC, ABALKY, ABALPH, ABAT1 FROM OPENQUERY(JDE, '
        SELECT * FROM PRODDTA.F0101
        WHERE ABALKY IN (''13514547'', ''21485111'')
      ')
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

export default testHandler;