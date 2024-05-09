// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

/**
  * El tipo `BodyProps` en TypeScript define un objeto con una propiedad `name` de tipo cadena.
  * @property {cadena} name: la propiedad `name` en el tipo `BodyProps` representa el nombre del trasporte.
  */
type BodyProps = {
  name: string,
}

/**
  * La función `testHandler` es una función asincrónica que recupera datos de transporte basándose en un
  * proporciona el parámetro de consulta de nombre y devuelve una respuesta JSON con la información de transporte filtrada o
  * un mensaje de error si hay algún problema.
  * @param {NextApiRequest} NextApiRequest: el parámetro `request` en su función `testHandler` es de tipo
  * `NextApiRequest`, que normalmente se usa en las rutas API de Next.js para representar el HTTP entrante
  * pedido. Contiene información sobre la solicitud, como encabezados, cuerpo, parámetros de consulta y
  * más.
  * @param {NextApiResponse} NextApiResponse: el parámetro `respuesta` en la función `testHandler` es un
  * objeto que representa la respuesta HTTP que se enviará al cliente. Le permite configurar el
  * código de estado de la respuesta y envío de datos al cliente en varios formatos como JSON.
  */
const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
     // Obtenemos el nombre del transporte desde el cuerpo de la solicitud
    const { name }: BodyProps = request.body

    // Creamos una consulta SQL para buscar transportes que coincidan con el nombre proporcionado
    const queryString = `
      SELECT * FROM [HDTA025].[dbo].[H025_T_TRA]
      WHERE TRA_NOM LIKE '%${name.toUpperCase()}%'
    `

    // const sequelize = await getSequelize()
    // Ejecutamos la consulta SQL utilizando Sequelize
    const [data] = await sequelize.query(queryString) as [T_TRA[], unknown]

    // Convertimos los resultados de la consulta en un array de objetos Transport
    const transports: Transport[] = data.map((transport) => {
      return {
        name: transport["TRA_NOM"],
        RIF: transport["TRA_RIF"],
        code: transport["TRA_COD"],
      }
    })

    response.status(200).json(transports);

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default testHandler;