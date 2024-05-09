// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * La función `densityHandler` recupera datos de una tabla de base de datos y los envía como una respuesta JSON,
 * Ademas se encarga del manejo de cualquier error que ocurra.
 * @param {NextApiRequest} NextApiRequest: el parámetro `request` en la función `densityHandler` es de
 * escriba `NextApiRequest`, que normalmente se usa en las rutas API de Next.js para representar el HTTP entrante
 * pedido. Contiene información sobre la solicitud entrante, como encabezados, parámetros de consulta y
 * contenido corporal. 
 * @param {NextApiResponse} response: el parámetro `respuesta` en la función `densityHandler` es un
 * objeto que representa la respuesta HTTP que se enviará al cliente. Te permite enviar y devolver datos al cliente,
 * establecer encabezados y controlar el estado de la respuesta. En este caso, la "respuesta"
 * del objeto es una instancia
 */

const densityHandler = async (request: NextApiRequest, response: NextApiResponse) => {

  try {
    //consulta sql
    const queryString = `SELECT * FROM [HDTA025].[dbo].[H025_T_DEN]`
    // const sequelize = await getSequelize()
    //Se guardan los datos de las consultas en la variable data
    const [data] = await sequelize.query(queryString) as [T_DEN[], unknown]
    //Se envia la variable data como respuesta
    response.json(data)

  } catch (error) {
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    })
  }
}

export default densityHandler;