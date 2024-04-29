// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { DRIVER_NOT_FOUND } from "@/utils/services/errorMessages";
import { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  driverID: number,
  field: "CON_COD" | "CON_CED"
}

const driversHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {

    const METHOD = request.method
    const { driverID, field }: BodyProps = request.body

    const getField = {
      CON_COD: "ABAN8",
      CON_CED: "ABALKY",
    }

    if (METHOD === "POST") {

      const origin = {
        SIPVEH: 0,
        JDE: 1,
      }

      const { SIPVEH, JDE } = origin

      let ORI_ID = JDE
      let drivers: T_CON[] = []
      
      // JDE Datos Conductor
      const distDriverQuery = `
        SELECT 
          ABALPH as CON_NOM, 
          ABALKY as CON_CED, 
          ABAN8 as CON_COD
        FROM OPENQUERY(JDE, '
          SELECT * FROM PRODDTA.F0101
          WHERE ${getField[field]} = ''${driverID}''
        ')
      `
      
      // const sequelize = await getSequelize()
      drivers = (await sequelize.query(distDriverQuery) as [T_CON[], unknown])[0]
      ORI_ID = JDE
      
      console.log('JDE drivers', drivers)
      
      if(!drivers.length){
        const sipvehDriverQuery = `
          SELECT * FROM [HDTA025].[dbo].[H025_T_CON] 
          WHERE ${field} = '${driverID}'
        `
        
        drivers = (await sequelize.query(sipvehDriverQuery) as [T_CON[], unknown])[0]
        ORI_ID = SIPVEH
        console.log('SIPVEH drivers', drivers)
      }
      
      if (drivers.length) {

        const driver: Driver = {
          name: drivers[0].CON_NOM,
          cedula: drivers[0].CON_CED,
          code: drivers[0].CON_COD,
          originID: ORI_ID,
        }

        response.json(driver)

      } else {
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