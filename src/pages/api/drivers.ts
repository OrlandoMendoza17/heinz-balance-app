// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { DRIVER_NOT_FOUND } from "@/utils/services/errorMessages";
import { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  driverPersonalID: number,
}

const driversHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {

    const METHOD = request.method
    const { driverPersonalID }: BodyProps = request.body

    if (METHOD === "POST") {

      const queryString = `
        SELECT * FROM [HDTA025].[dbo].[H025_T_CON] 
        WHERE CON_CED = '${driverPersonalID}'
      `
      
      // const sequelize = await getSequelize()
      const [data] = await sequelize.query(queryString) as [T_CON[], unknown]
      
      if(data.length){
        
        const driver: Driver = {
          name: data[0].CON_NOM,
          cedula: data[0].CON_CED,
          code: data[0].CON_COD,
        }
  
        response.json(driver)
        
      }else{
        response.status(400).json({
          message: DRIVER_NOT_FOUND
        });
      }

    } else {

      response.status(400).json({
        message: "Bad Request"
      });

    }

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default driversHandler;