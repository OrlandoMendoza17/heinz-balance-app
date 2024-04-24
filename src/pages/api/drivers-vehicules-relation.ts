// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { DRIVER_NOT_FOUND, DRIVER_VEHICULE_RELATION_NOT_FOUND } from "@/utils/services/errorMessages";
import { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  vehicule: Vehicule,
}

type JDERelation = {
  VSSTFN: number, // Driver ID
  VSVEHI: string  // Vehicule Plate
}

const driversHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {

    const METHOD = request.method
    const { vehicule }: BodyProps = request.body
    
    const origin = {
      SIPVEH: 0,
      JDE: 1,
    }

    const { SIPVEH, JDE } = origin

    if (METHOD === "POST") {

      // JDE Relación Conductor-Vehículo
      const JDERelationQuery = `
        select VSSTFN, VSVEHI from openquery(jde, '
          SELECT * FROM PRODDTA.F49041
          WHERE VSVEHI in (''${vehicule.plate}'')
        ')
      `

      const [relation] = await sequelize.query(JDERelationQuery) as [JDERelation[], unknown]

      // JDE Datos Conductor (Busca por el Driver ID -> VSSTFN)
      const distDriverQuery = `
        select ABAN8, ABTAXC, ABALKY, ABALPH, ABAT1 from openquery(jde, '
          SELECT * FROM PRODDTA.f0101
          WHERE ABAN8 in (''${relation[0].VSSTFN}'')
        ')
      `

      const [drivers] = await sequelize.query(distDriverQuery) as [JDEDriver[], unknown]

      if (drivers.length) {

        const driver: Driver = {
          name: drivers[0].ABALPH,
          cedula: drivers[0].ABALKY,
          code: drivers[0].ABAN8.toString(),
          appOrigin: JDE,
        }

        response.json(driver)

      } else {
        response.status(400).json({
          message: "No se ha podido encontrar una relación entre el vehículo y un conductor"
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