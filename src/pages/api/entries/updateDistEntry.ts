// import getSequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/mssql";
import { getUPDATEValues } from "@/utils/api/update";

type BodyProps = {
  distEntry: P_ENT_DI;
};

/**
 * Handler para actualizar una entrada de distribución.
 * 
 * @param {NextApiRequest} request - La solicitud HTTP.
 * @param {NextApiResponse} response - La respuesta HTTP.
 */
const updateDistEntryHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    // Obtiene el objeto de cuerpo de la solicitud, que contiene la entrada de distribución a actualizar.
    // El objeto se desestructura para obtener la propiedad `distEntry`.
    const { distEntry }: BodyProps = request.body

    const values = getUPDATEValues(distEntry)
    // Construye la cadena de valores a actualizar en la consulta SQL.
    const queryString = `
      UPDATE H025_P_ENT_DI
      SET 
        ${values}
      WHERE ENT_NUM = ${distEntry.ENT_NUM};
    `
    // Ejecuta la consulta SQL para actualizar la entrada de distribución.
    // const sequelize = await getSequelize()
    await sequelize.query(queryString)



    // Devuelve la respuesta HTTP con un mensaje de éxito.
    response.status(200).json({
      message: `Dist Entry ${distEntry.ENT_NUM} Updated Succesfully`
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

export default updateDistEntryHandler;