// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getSequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { format } from 'date-fns';

type Data = {
  name: string;
};

const todaysExitsHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    
  const today = format(new Date(), "yyyy-LL-dd")
  
  const queryString = `
    SELECT * FROM [HDTA025].[dbo].H025_P_SAL
    WHERE CONVERT(DATE, SAL_FEC) = '${today}'
    ORDER BY ENT_NUM DESC;
  `
    const sequelize = await getSequelize()
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

export default todaysExitsHandler;