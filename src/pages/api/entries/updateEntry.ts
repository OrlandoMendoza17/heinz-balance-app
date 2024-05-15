// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUPDATEValues } from "@/utils/api/update";

type BodyProps = {
  entryNumber: P_ENT["ENT_NUM"],
  entry: UpdateP_ENT
};

/**
 * Handler para actualizar una entrada.
 * 
 * @param {NextApiRequest} request - La solicitud HTTP.
 * @param {NextApiResponse} response - La respuesta HTTP.
 */
const updateEntryHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    // Obtiene el objeto de cuerpo de la solicitud, que contiene la entrada a actualizar.
    // El objeto se desestructura para obtener las propiedades `entryNumber` y `entry`.
    const { entryNumber, entry }: BodyProps = request.body

    // Construye la cadena de valores a actualizar en la consulta SQL.
    const values = getUPDATEValues(entry)
    
    // Construye la consulta SQL para actualizar la entrada.
    const queryString = `
      UPDATE H025_P_ENT
      SET 
        ${values}
      WHERE ENT_NUM = ${entryNumber};
    `
    
    // const sequelize = await getSequelize()
    // Ejecuta la consulta SQL para actualizar la entrada.
    await sequelize.query(queryString)

    // Devuelve la respuesta HTTP con un mensaje de éxito
    response.status(200).json({
      message: `Entry ${entryNumber} Updated Succesfully`
    });

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

export default updateEntryHandler;