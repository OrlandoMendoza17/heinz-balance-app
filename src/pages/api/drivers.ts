// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { createDriver } from "@/services/transportInfo";
import { DRIVER_NOT_FOUND } from "@/utils/services/errorMessages";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Propiedades del cuerpo
 * 
 * @param {number} driverID Id del conductor
 * @param {"CON_COD" | "CON_CED"} field Codigo del conductor  y cedula del conductor
 */
type BodyProps = {
  driverID: number,
  field: "CON_COD" | "CON_CED"
}

/**
 * Manejador de solicitudes para obtener información de conductores.
 * 
 * @param {NextApiRequest} request - La solicitud entrante.
 * @param {NextApiResponse} response - La respuesta saliente.
 */
const driversHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    //Obtiene el método de la solicitud y los parámetros del cuerpo de la solicitud.
    const METHOD = request.method
    const { driverID, field }: BodyProps = request.body

    //Define un objeto que mapea campos de búsqueda con sus correspondientes campos en la base de datos.
    const getField = {
      CON_COD: "ABAN8",
      CON_CED: "ABALKY",
    }

    //Inicializa variables para indicar si se encontró el conductor en SQL o JDE.
    if (METHOD === "POST") {

      let SQL_NOT_FOUND = false
      let JDE_FOUND = false
      //Define un objeto que contiene los orígenes de datos (SIPVEH y JDE).
      const origin = {
        SIPVEH: 0,
        JDE: 1,
      }

      const { SIPVEH, JDE } = origin
      //Selecciona el origen de datos por defecto (SIPVEH).
      let ORI_ID = SIPVEH
      let drivers: T_CON[] = []
      //Construye la consulta SQL para buscar el conductor en SIPVEH.
      const sipvehDriverQuery = `
        SELECT * FROM [HDTA025].[dbo].[H025_T_CON] 
        WHERE ${field} = '${driverID}'
      `

      //Ejecuta la consulta SQL y almacena el resultado en la variable drivers.
      drivers = (await sequelize.query(sipvehDriverQuery) as [T_CON[], unknown])[0]
      ORI_ID = SIPVEH
      console.log('SIPVEH drivers', drivers)

      // Si no se encontró el conductor en SIPVEH, busca en JDE.
      if (!drivers.length) {
        //Construye la consulta para buscar el conductor en JDE.
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
        // Ejecuta la consulta y almacena el resultado en la variable drivers.
        // const sequelize = await getSequelize()
        drivers = (await sequelize.query(distDriverQuery) as [T_CON[], unknown])[0]
        ORI_ID = JDE

        //Indica que se encontró el conductor en JDE.
        if (drivers.length) {
          SQL_NOT_FOUND = true
          JDE_FOUND = true
        }

        console.log('JDE drivers', drivers)
      }
      //Si se encontró el conductor, crea un objeto con la información del conductor y devuelve la respuesta.
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
        //Si no se encontró el conductor, devuelve un error 400 con un mensaje de no encontrado
        response.status(400).json({
          message: DRIVER_NOT_FOUND
        });
      }

    } else {
      //Si el método de la solicitud no es POST, devuelve un error 400 con un mensaje de solicitud incorrecta.
      response.status(400).json({
        message: "Bad Request"
      });

    }

  } catch (error) {
    //Captura cualquier error que ocurra durante la ejecución del manejador y devuelve un error 500 con un mensaje de error
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default driversHandler;