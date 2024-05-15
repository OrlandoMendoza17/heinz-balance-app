// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { createVehicule } from "@/services/transportInfo";
import { DRIVER_NOT_FOUND, DRIVER_VEHICULE_RELATION_NOT_FOUND } from "@/utils/services/errorMessages";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @param {Vehicule} vehicule Tipo de vehiculo 
 */
type BodyProps = {
  vehicule: Vehicule,
}

/**
 * @param {number} VSSTFN Id del conductor
 * @param {string} VSVEHI Placa del vehiculo
 */
type JDERelation = {
  VSSTFN: number, // Driver ID
  VSVEHI: string  // Vehicule Plate
}

/**
 * Manejador de solicitudes para obtener la relación entre un vehículo y un conductor.
 * 
 * @param {NextApiRequest} NextApiRequest - La solicitud entrante.
 * @param {NextApiResponse} NextApiResponse - La respuesta saliente.
 */
const driversHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    //Obtiene el método de la solicitud y el objeto vehículo del cuerpo de la solicitud.
    const METHOD = request.method
    const { vehicule }: BodyProps = request.body

    //Define un objeto que contiene los orígenes de datos (SIPVEH y JDE).
    const origin = {
      SIPVEH: 0,
      JDE: 1,
    }

    //Desestructura el objeto origin para obtener los valores individuales
    const { SIPVEH, JDE } = origin

    if (METHOD === "POST") {
      
      //Construye la consulta para obtener la relación entre el vehículo y el conductor en JDE.

      const JDERelationQuery = `
        select VSSTFN, VSVEHI from openquery(jde, '
          SELECT * FROM PRODDTA.F49041
          WHERE VSVEHI in (''${vehicule.plate}'')
        ')
      `
      //Ejecuta la consulta y almacena el resultado en la variable relation.

      const [relation] = await sequelize.query(JDERelationQuery) as [JDERelation[], unknown]


      // JDE Datos Conductor (Busca por el Driver ID -> VSSTFN)
      const distDriverQuery = `
        select ABAN8, ABTAXC, ABALKY, ABALPH, ABAT1 from openquery(jde, '
          SELECT * FROM PRODDTA.f0101
          WHERE ABAN8 in (''${relation[0].VSSTFN}'')
        ')
      `

      //Ejecuta la consulta y almacena el resultado en la variable drivers.
      const [drivers] = await sequelize.query(distDriverQuery) as [JDEDriver[], unknown]

     
      if (drivers.length) {

        //Crea un objeto con la información del conductor y devuelve la respuesta.
        const driver: Driver = {
          name: drivers[0].ABALPH,
          cedula: drivers[0].ABALKY,
          code: drivers[0].ABAN8.toString(),
          originID: JDE,
        }

        response.json(driver)

      } else {
        //Si no se encontró la relación entre el vehículo y el conductor, devuelve un error 400 con un mensaje de no encontrado.
        response.status(400).json({
          message: "No se ha podido encontrar una relación entre el vehículo y un conductor"
        });
      }

    } else {
      //Si el método de la solicitud no es POST, devuelve un error 400 con un mensaje de solicitud incorrecta.
      response.status(400).json({
        message: "Bad Request en driver relations"
      });

    }

  } catch (error) {
    //Captura cualquier error que ocurra durante la ejecución del manejador y devuelve un error 500 con un mensaje de error.
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default driversHandler;