// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const nextEntryHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    
    const queryString = `
      SELECT TOP 1 ENT_NUM FROM H025_P_ENT
      ORDER BY ENT_NUM DESC
    `
    
    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [{ENT_NUM: string}[], unknown]
    
    response.status(200).json({
      nextEntryNumber: (parseInt(data[0].ENT_NUM) + 1).toString()
    });
    
  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
  
}

export default nextEntryHandler;