// import getSequelize from "@/lib/mssql"
import sequelize from "@/lib/mssql"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

/**
 * El tipo `BodyProps` en TypeScript define una propiedad `table` que puede tener un valor de cualquiera de los dos
 * “OPERACIÓN” o “DESTINO”.
 * @property {"OPERACIÓN" | "DESTINO"} table: la propiedad `table` del tipo `BodyProps` puede
 * tener un valor de "OPERACIÓN" o "DESTINO".
 */
type BodyProps = {
  table: "OPERATION" | "DESTINATION",
}

//Une los datos T_DES y T_OPE para crear el tipo destinations
/**
 * El tipo Destinations esta formado por una union de T_DES y T_OPE
 * @param {DES_COD} DES_COD : Codigo de destino
 * @param {string} OPE_COD : Codigo de operacion
 * @param {string} DES_DES : Descripcion del destino 
 */ 
export type DESTINATIONS = Pick<T_DES & T_OPE, "DES_COD" | "OPE_COD" | "DES_DES">


/**
 * La función `plantHandler` es una función asincrónica que maneja solicitudes POST consultando un
 * base de datos para los datos de destino y devolverlos como una respuesta JSON, mientras maneja otras solicitudes
 * métodos con respuesta de error.
   @param {NextApiRequest} NextApiRequest:
   
   el parámetro `request` en la función `plantHandler` es un
 * objeto que representa la solicitud HTTP entrante. Contiene información como el método HTTP.
 * (GET, POST, PUT, DELETE, etc.), encabezados de solicitud, cuerpo de solicitud, parámetros de consulta y más. En esto
 * caso, la request
 * @param {NextApiResponse} response: el parámetro `response` en la función `plantHandler` es un
 * objeto que representa la respuesta HTTP que el servidor envía al cliente. Te permite
 * enviar datos al cliente, establecer encabezados de respuesta y controlar el código de estado de la respuesta. En esto
 * fragmento de código, el objeto `response`
 */
const plantHandler = async (request: NextApiRequest, response: NextApiResponse) => {

  const method = request.method
  const { table }: BodyProps = request.body

  try {
    if (method === "POST") {
      // Consulta sql
      const queryString = `
        SELECT H025_T_DES.DES_COD, H025_T_OPE.OPE_COD, H025_T_DES.DES_DES
        FROM [HDTA025].[dbo].H025_T_DES
        INNER JOIN [HDTA025].[dbo].H025_T_OPE ON H025_T_DES.DES_COD = H025_T_OPE.DES_COD
        ORDER BY DES_COD ASC;
      `
      
      // const sequelize = await getSequelize()
      //Guardando los resultados de la consulta en la variable data
      const [data] = await sequelize.query(queryString) as [DESTINATIONS[], unknown]
      //Enviando los resultados de la consulta como respuesta 
      response.json(data)

    } else {

      throw new Error("Wrong request")

    }

  } catch (error) {
    response.status(500).json({
      status: 500,
      error,
    })
  }
}

export default plantHandler;