// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { createVehicule } from "@/services/transportInfo";
import { VEHICULE_COMPANY_NOT_FOUND, VEHICULE_NOT_FOUND } from "@/utils/services/errorMessages";
import { NextApiRequest, NextApiResponse } from "next";

/**
  * El tipo `BodyProps` en TypeScript define propiedades para una identificación de vehículo y un tipo de campo.
  * @property {string} vehiculeID La propiedad `vehiculeID` en el tipo `BodyProps` representa un valor de cadena que se utiliza para identificar un vehículo.
  * @property {"VEH_PLA" | "VEH_ID"} field: la propiedad `field` en el tipo `BodyProps` puede tener una
  * de dos valores posibles: "VEH_PLA"->Placa del vehiculo  o "VEH_ID"-> Id del vehiculo.
  */
type BodyProps = {
  vehiculeID: string,
  field: "VEH_PLA" | "VEH_ID",
}

/**
  * La función `driversHandler` es una función asincrónica que maneja solicitudes relacionadas con
  * recuperar y crear información del vehículo a partir de bases de datos SQL y JDE.
  * @param {NextApiRequest} NextApiRequest: el código que proporcionaste es una función asincrónica `driversHandler`
  * que maneja solicitudes de API. Comprueba el método de la solicitud, recupera datos de la solicitud.
  * carrocería, y realiza consultas a bases de datos para encontrar información sobre vehículos.
  * @param {NextApiResponse} NextApiResponse: el código que proporcionó es una función de controlador de ruta de la API de Next.js
  * que maneja solicitudes relacionadas con conductores y vehículos. Realiza diversas operaciones como
  * consultar una base de datos SQL para obtener información del vehículo, consultar una base de datos JDE si no se encuentra el vehículo
  * en SQL, creando un vehículo en SQL si se encuentra en J
  */
const driversHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    // Obtenemos el método de la solicitud y los parámetros del cuerpo de la solicitud
    const METHOD = request.method
    const { vehiculeID, field }: BodyProps = request.body

    if (METHOD === "POST") {
      // Inicializamos variables para indicar si el vehículo fue encontrado en SQL o JDE
      let SQL_NOT_FOUND = false
      let JDE_FOUND = false

      // Definimos un objeto con los orígenes de los vehículos
      const origin = {
        SIPVEH: 0,
        JDE: 1,
      }

      const { SIPVEH, JDE } = origin

      // const sequelize = await getSequelize()
      
      console.log('vehiculeID', vehiculeID)
      console.log('field', field)
      
     /**
        * La función `getSQLVehicule` // Creamos una función para buscar el vehículo en la base de datos SQL
        * @returns La función `getSQLVehicule` devuelve el resultado de la consulta SQL ejecutada usando
        * Secuela. El resultado es una matriz que contiene los vehículos que coinciden con la condición especificada.
        * en la consulta SQL. 
        */
      const getSQLVehicule = async () => {
        // SQL Vehicule
        const SQL_VehiculesQuery = `
          SELECT * FROM [HDTA025].[dbo].[H025_T_VEH] 
          WHERE ${field} = '${vehiculeID}'
          -- AND ORI_ID = ${SIPVEH}
        `
        const [vehicules] = await sequelize.query(SQL_VehiculesQuery) as [T_VEH[], unknown]
        console.log("Buscando en SQL...")
        console.log('SQL vehicules', vehicules)
        return vehicules
      }

      let vehicules = await getSQLVehicule()

      // Si no existe el vehículo en T_VEH y el campo guarado en field es una placa, me lo busca en JDE
      if (!vehicules.length && field === "VEH_PLA") {
         // Creamos la consulta JDE para buscar el vehículo
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

        // Ejecutamos la consulta JDE y obtenemos los resultados
        vehicules = (await sequelize.query(JDE_VehiculesQuery) as [T_VEH[], unknown])[0]
        
        //Si se encontro el vehiculo se colocan los valores como true
        if(vehicules.length){
          SQL_NOT_FOUND = true //No se encontro en SQL
          JDE_FOUND = true // Se encontro en JDE
        }
        
        console.log("Buscando en JDE...")
        console.log('JDE vehicules', vehicules)
      }
      
      // Si se encontró el vehículo, buscamos la información del transportista asociado
      if (vehicules.length) {

        const tranportQuery = `
          SELECT * FROM [HDTA025].[dbo].[H025_T_TRA]
          WHERE TRA_COD = '${vehicules[0].TRA_COD}'
        `

        const [transports] = await sequelize.query(tranportQuery) as [T_TRA[], unknown]

        if (transports.length) {

          // Si no se encontró el vehículo en SQL pero sí en JDE, creamos el vehículo en SQL
          if (SQL_NOT_FOUND && JDE_FOUND) {
            console.log("Creando vehículo en SQL...")
            //Destructurando un objetvo de tipo vehiculo para crear una variable sin el VEH_ID
            const { VEH_ID, ...vehiculeInfo } = vehicules[0]
            await createVehicule(vehiculeInfo, JDE)

            vehicules = await getSQLVehicule()
          }
          //Se asignan los datos del vehiculo creado en el objeto vehicule
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
          //Se regresan los datos en la respuesta 
          response.json(vehicule)

        } else {
          response.status(400).json({
            message: VEHICULE_COMPANY_NOT_FOUND
          });
        }

      } else {
        response.status(400).json({
          message: "No se ha podido encontrar el vehículo"
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