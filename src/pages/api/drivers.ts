// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { createDriver } from "@/services/transportInfo";
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

      let SQL_NOT_FOUND = false
      let JDE_FOUND = false

      const origin = {
        SIPVEH: 0,
        JDE: 1,
      }

      const { SIPVEH, JDE } = origin

      let ORI_ID = SIPVEH
      let drivers: T_CON[] = []

      const sipvehDriverQuery = `
        SELECT * FROM [HDTA025].[dbo].[H025_T_CON] 
        WHERE ${field} = '${driverID}'
      `

      drivers = (await sequelize.query(sipvehDriverQuery) as [T_CON[], unknown])[0]
      ORI_ID = SIPVEH
      console.log('SIPVEH drivers', drivers)

      // Si no existe el el conductor en T_CON, me lo busca en JDE
      if (!drivers.length) {
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

        if (drivers.length) {
          SQL_NOT_FOUND = true
          JDE_FOUND = true
        }

        console.log('JDE drivers', drivers)
      }

      if (drivers.length) {

        const driver: Driver = {
          name: drivers[0].CON_NOM,
          cedula: drivers[0].CON_CED,
          code: drivers[0].CON_COD,
          originID: ORI_ID,
        }

        // Si no existe el vehículo en SQL pero sí en JDE, lo crea automaticamente en SQL
        if (SQL_NOT_FOUND && JDE_FOUND) {
          const driverInfo = { ...drivers[0], ORI_ID }
          await createDriver(driverInfo)
          console.log("Creando vehículo en SQL...")
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