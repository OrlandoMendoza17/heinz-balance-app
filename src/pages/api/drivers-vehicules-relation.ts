// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { DRIVER_NOT_FOUND, DRIVER_VEHICULE_RELATION_NOT_FOUND } from "@/utils/services/errorMessages";
import { da } from "date-fns/locale";
import { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  vehiculeId: T_VEH["VEH_ID"],
}

const driversHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {

    const METHOD = request.method
    const { vehiculeId }: BodyProps = request.body

    if (METHOD === "POST") {

      const queryString = `
        SELECT * FROM [HDTA025].[dbo].[H025_T_CON_VEH] 
        WHERE VEH_ID = '${vehiculeId}'
      `

      // const sequelize = await getSequelize()
      const [data] = await sequelize.query(queryString) as [T_CON_VEH[], unknown]

      if (data.length) {
        
        const { CON_COD } = data[0]

        const queryString = `
          SELECT * FROM [HDTA025].[dbo].[H025_T_CON] 
          WHERE CON_COD = '${CON_COD}'
        `

        // const sequelize = await getSequelize()
        const [drivers] = await sequelize.query(queryString) as [T_CON[], unknown]
        
        if (drivers.length) {

          const driver: Driver = {
            name: drivers[0].CON_NOM,
            cedula: drivers[0].CON_CED,
            code: drivers[0].CON_COD,
          }
  
          response.json(driver)
  
        } else {
          response.status(400).json({
            message: DRIVER_NOT_FOUND
          });
        }
        
      } else {
        response.status(400).json({
          message: DRIVER_VEHICULE_RELATION_NOT_FOUND
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