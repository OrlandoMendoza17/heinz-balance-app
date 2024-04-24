// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { VEHICULE_COMPANY_NOT_FOUND, VEHICULE_NOT_FOUND } from "@/utils/services/errorMessages";
import { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  vehiculePlate: string,
}

const driversHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {

    const METHOD = request.method
    const { vehiculePlate }: BodyProps = request.body

    console.log('vehiculePlate', vehiculePlate)

    if (METHOD === "POST") {

      const origin = {
        SIPVEH: 0,
        JDE: 1,
      }

      const { SIPVEH, JDE } = origin
      
      let vehicules: T_VEH[] = []
      let ORI_ID: T_VEH["ORI_ID"] = SIPVEH

      // const sequelize = await getSequelize()

      // JDE Vehicule
      const JDE_VehiculesQuery = `
        SELECT * FROM OPENQUERY(JDE, '
          SELECT
            VMVEHN as VEH_ID,
            VMVEHI as VEH_PLA,
            VMDL01 as VEH_MOD,
            VMVTYP as VEH_TIP,
            VMWTCA as VEH_CAP,
            VMVOWN as TRA_COD
          FROM PRODDTA.f4930
          WHERE VMVEHI in (''${vehiculePlate}'')
        ')
      `

      // Lo busca entre los vehículos creados en distribu
      vehicules = (await sequelize.query(JDE_VehiculesQuery) as [T_VEH[], unknown])[0]
      ORI_ID = JDE // Lo asigna como que viene de JDE 

      console.log('JDE vehicules', vehicules)

      if (!vehicules.length) {
        // SQL Vehicule
        const SQL_VehiculesQuery = `
          SELECT * FROM [HDTA025].[dbo].[H025_T_VEH] 
          WHERE VEH_PLA = '${vehiculePlate}'
          AND ORI_ID = ${SIPVEH}
        `
        vehicules = (await sequelize.query(SQL_VehiculesQuery) as [T_VEH[], unknown])[0]
        ORI_ID = SIPVEH // Lo asigna como que viene de SIPVEH 

        console.log('SQL vehicules', vehicules)
      }

      if (vehicules.length) {

        const tranportQuery = `
          SELECT * FROM [HDTA025].[dbo].[H025_T_TRA]
          WHERE TRA_COD = '${vehicules[0].TRA_COD}'
        `

        const [transports] = await sequelize.query(tranportQuery) as [T_TRA[], unknown]

        if (transports.length) {

          const vehicule: Vehicule = {
            id: vehicules[0].VEH_ID,
            plate: vehicules[0].VEH_PLA,
            model: vehicules[0].VEH_MOD,
            type: vehicules[0].VEH_TIP,
            capacity: vehicules[0].VEH_CAP,
            company: transports[0].TRA_NOM,
            originID: ORI_ID,
          }

          response.json(vehicule)

        } else {
          response.status(400).json({
            message: VEHICULE_COMPANY_NOT_FOUND
          });
        }

      } else {
        response.status(400).json({
          message: VEHICULE_NOT_FOUND
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