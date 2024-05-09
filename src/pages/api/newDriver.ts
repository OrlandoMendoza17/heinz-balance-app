// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInsertAttributes } from "@/utils/api/insert";


/**
 * El tipo `BodyProps` en TypeScript define propiedades para un controlador y una ID de origen.
 * @property {T_CON} Driver: se espera que la propiedad `driver` en el tipo `BodyProps` sea del tipo
 *`T_CON`.
 * @property {1 | 0} ORI_ID: la propiedad `ORI_ID` en el tipo `BodyProps` es un tipo de unión que puede
 * tiene un valor de "1" o "0" y representa el origen de la informacion 0-Balanzas 1-JDE.
 */
type BodyProps = {
  driver: T_CON,
  ORI_ID: 1 | 0
}

/**
 * La función `newDriverHandler` es un controlador asincrónico para crear un nuevo registro de controlador en un
 * base de datos mediante una solicitud POST.
 * @param {NextApiRequest} NextApiRequest: el parámetro `request` en la función `newDriverHandler` es de
 * escriba `NextApiRequest`, que es un tipo proporcionado por Next.js para manejar solicitudes de API. Contiene
 * información sobre la solicitud HTTP entrante, como encabezados, cuerpo, método y parámetros de consulta.
 * @param {NextApiResponse} NextApiResponse: el parámetro `response` en la función `newDriverHandler` es
 * un objeto que representa la respuesta HTTP que el punto final de la API enviará al cliente. Tiene
 * métodos como `status()` para establecer el código de estado HTTP de la respuesta y `json()` para enviar un JSON
 * respuesta al cliente
 */
const newDriverHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
     // Obtenemos el método de la solicitud (POST, GET, PUT, DELETE, etc.)
    const METHOD = request.method

    // Si el método es POST, creamos un nuevo conductor
    if (METHOD === "POST") {
      // Obtenemos el cuerpo de la solicitud, que contiene la información del conductor
      const { driver }: BodyProps = request.body

      const [keys, values] = getInsertAttributes(driver)
      
      const queryString = `
        INSERT H025_T_CON\n${keys} 
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

export default newDriverHandler;