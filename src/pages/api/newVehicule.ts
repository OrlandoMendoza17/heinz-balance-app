// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSQLValue } from "./entries/newEntry";

/**
 * El tipo `BodyProps` en TypeScript define una estructura con una propiedad de vehículo excluyendo VEH_ID
 * campo y una propiedad ORI_ID que puede ser 1 o 0.
 * @property vehicule - La propiedad `vehicule` en el tipo `BodyProps` es un objeto que contiene todos
 * propiedades del tipo `T_VEH` excepto la propiedad `VEH_ID`.
 * @propiedad {1 | 0} ORI_ID: la propiedad `ORI_ID` habla del origen de la informacion (0-Balanzas 1-JDE)
 */
type BodyProps = {
  vehicule: Omit<T_VEH, "VEH_ID">,
  ORI_ID: 1 | 0
}

/**
  * La función `newVehiculeHandler` maneja solicitudes POST para crear un nuevo vehículo y construye un SQL
  * consulta basada en el cuerpo de la solicitud y la ejecuta usando Sequelize, respondiendo con el estado apropiado
  * códigos.
  * Solicitud @param {NextApiRequest} NextApiRequest: el parámetro `request` en la función `newVehiculeHandler` es de
  * escriba `NextApiRequest`, que es un tipo proporcionado por Next.js para manejar solicitudes de API. Contiene
  * información sobre la solicitud HTTP entrante, como encabezados, cuerpo, método y parámetros de consulta.
  * @param {NextApiResponse} NextApiResponse: el parámetro `respuesta` en la función `newVehiculeHandler` es
  * un objeto que representa la respuesta HTTP que el servidor envía al cliente. Te permite
  * establecer el código de estado de la respuesta, enviar datos al cliente en varios formatos (JSON, texto,
  * etc.),
  */
const newVehiculeHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    // Obtenemos el método de la solicitud (POST, GET, PUT, DELETE, etc.)
    const METHOD = request.method
    // Si el método es POST, creamos un nuevo vehículo
    if (METHOD === "POST") {
      // Obtenemos el cuerpo de la solicitud, que contiene la información del vehículo y su ID de origen (ORI_ID)
      const { vehicule, ORI_ID }: BodyProps = request.body
      
      // Asignamos el ORI_ID al objeto vehicule
      vehicule.ORI_ID = ORI_ID
      
       // Creamos una cadena con las claves del objeto vehicule, rodeadas de corchetes
      const keys = `(${Object.keys(vehicule).map(key => `[${key}]`).join(", ")})`
      // Creamos una cadena con los valores del objeto vehicule, convirtiéndolos a formato SQL
      const values = `(${Object.values(vehicule).map(value => getSQLValue(value)).join(", ")})`

      // Creamos la consulta SQL para insertar el nuevo vehículo
      const queryString = `
        INSERT H025_T_VEH\n${keys} 
        VALUES ${values}
      `
      // Imprimimos la consulta SQL para depuración
      console.log('queryString', queryString)
      
      // const sequelize = await getSequelize()
      // Ejecutamos la consulta SQL utilizando Sequelize
      await sequelize.query(queryString)

      // Respondemos con un estado 201 (Created) y un mensaje de éxito
      response.status(201).json({
        message: "Created Succesfully",
      });

    } else {
      // Si el método no es POST, respondemos con un estado 400 (Bad Request)
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

export default newVehiculeHandler;