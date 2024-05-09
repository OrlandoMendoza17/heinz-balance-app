// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";



/**
 * La función `modelsHandler` recupera datos de una tabla de base de datos y los envía como una respuesta JSON,
 * Manejo de cualquier error que ocurra.
 * Solicitud @param {NextApiRequest} request: el parámetro `request` en su función `modelsHandler` es de
 * escriba `NextApiRequest`, que probablemente sea un objeto que representa la solicitud HTTP entrante en un Next.js
 * Ruta API. Este objeto contiene información sobre la solicitud, como encabezados, parámetros de consulta y
 * contenido corporal. Puedes acceder a esta información
 * @param {NextApiResponse} response: el parámetro `respuesta` en la función `modelsHandler` es un
 * objeto que representa la respuesta HTTP que se enviará al cliente. Te permite enviar
 * datos devueltos al cliente en varios formatos, como JSON, HTML o texto sin formato. En el código proporcionado
 * fragmento, la `respuesta
 */
const modelsHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    //Consulta sql
    const queryString = `SELECT * FROM [HDTA025].[dbo].[H025_T_MAT]`
    
    // const sequelize = await getSequelize()
    //Ejecucion de la consulta 
    const [data] = await sequelize.query(queryString) as [T_MAT[], unknown]

    //Devolver los resultados de la consulta en la respuesta
    response.json(data)

  } catch (error) {
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    })
  }
}

export default modelsHandler;