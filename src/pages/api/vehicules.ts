// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { createVehicule } from "@/services/transportInfo";
import { VEHICULE_COMPANY_NOT_FOUND, VEHICULE_NOT_FOUND } from "@/utils/services/errorMessages";
import { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  vehiculeID: string,
}

const driversHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {

    const METHOD = request.method
    const { vehiculeID }: BodyProps = request.body

    if (METHOD === "POST") {

      let SQL_NOT_FOUND = false
      let JDE_FOUND = false

      const origin = {
        SIPVEH: 0,
        JDE: 1,
      }

      const { SIPVEH, JDE } = origin

      // const sequelize = await getSequelize()

      const getSQLVehicule = async () => {
        // SQL Vehicule
        const SQL_VehiculesQuery = `
          SELECT * FROM [HDTA025].[dbo].[H025_T_VEH] 
          WHERE VEH_PLA = '${vehiculeID}'
          -- AND ORI_ID = ${SIPVEH}
        `
        const [vehicules] = await sequelize.query(SQL_VehiculesQuery) as [T_VEH[], unknown]
        console.log("Buscando en SQL...")
        console.log('SQL vehicules', vehicules)
        return vehicules
      }

      let vehicules = await getSQLVehicule()

      // Si no existe el vehículo en T_VEH, me lo busca en JDE
      if (!vehicules.length) {
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
            WHERE VMVEHI IN (''${vehiculeID}'')
          ')
        `

        // Lo busca entre los vehículos creados en distribu
        vehicules = (await sequelize.query(JDE_VehiculesQuery) as [T_VEH[], unknown])[0]
        
        if(vehicules.length){
          SQL_NOT_FOUND = true
          JDE_FOUND = true
        }
        console.log("Buscando en JDE...")
        console.log('JDE vehicules', vehicules)
      }

      if (vehicules.length) {

        const tranportQuery = `
          SELECT * FROM [HDTA025].[dbo].[H025_T_TRA]
          WHERE TRA_COD = '${vehicules[0].TRA_COD}'
        `

        const [transports] = await sequelize.query(tranportQuery) as [T_TRA[], unknown]

        if (transports.length) {

          // Si no existe el vehículo en SQL pero sí en JDE, lo crea automaticamente en SQL
          if (SQL_NOT_FOUND && JDE_FOUND) {
            console.log("Creando vehículo en SQL...")
            const { VEH_ID, ...vehiculeInfo } = vehicules[0]
            await createVehicule(vehiculeInfo, JDE)

            vehicules = await getSQLVehicule()
          }

          const vehicule: Vehicule = {
            id: vehicules[0].VEH_ID.toString(),
            plate: vehicules[0].VEH_PLA,
            model: vehicules[0].VEH_MOD,
            type: vehicules[0].VEH_TIP,
            capacity: vehicules[0].VEH_CAP,
            company: transports[0].TRA_NOM,
            companyID: transports[0].TRA_COD,
            originID: vehicules[0].ORI_ID,
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