// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

/** 
 * Cuerpo 
 */
type BodyProps = {
  entries: P_ENT["ENT_NUM"][];
};

/**
 * Handler para obtener las entradas correspondientes a los números de entrada proporcionados.
 * 
 * @param {NextApiRequest} request - La solicitud HTTP.
 * @param {NextApiResponse} response - La respuesta HTTP.
 */
const entriesHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    //Obtiene el objeto de cuerpo de la solicitud, que contiene la lista de números de entrada.
    //El objeto se desestructura para obtener la propiedad `entries`, que es un arreglo de números de entrada.
    const { entries }: BodyProps = request.body

    // Construye la consulta SQL para obtener las entradas correspondientes a los números de entrada proporcionados.
    // La consulta selecciona todas las columnas (`*`) de la tabla `H025_P_ENT` donde el número de entrada (`ENT_NUM`)
    // esté en la lista de números de entrada proporcionados, y ordena los resultados en orden descendente por número de entrada.

    const queryString = `
      SELECT * FROM H025_P_ENT
      WHERE ENT_NUM IN (${entries})
      ORDER BY ENT_NUM DESC
    `
    // Ejecuta la consulta SQL y obtiene el resultado.
    // El resultado es un arreglo de objetos que representan las entradas correspondientes a los números de entrada proporcionados.
    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [P_ENT[], unknown]

    //Devuelve la respuesta HTTP con el estado 200 y el arreglo de entradas correspondientes.
    response.status(200).json(data);

  } catch (error) {
    // Captura cualquier error que ocurra durante la ejecución del handler.
    // Registra el error en la consola y devuelve una respuesta HTTP con un código de estado 500.
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default entriesHandler;