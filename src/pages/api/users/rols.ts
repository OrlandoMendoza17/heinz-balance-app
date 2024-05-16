// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  userRolID: S_USU["ROL_COD"]
}

/**
 * Manejador de obtener roles.
 * 
 * @param {NextApiRequest} request - Request de Next.js.
 * @param {NextApiResponse} response - Response de Next.js.
 * 
 * @returns {Promise<void>} Promesa que se resuelve cuando se completan los roles.
 */
const rolsHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  /**
   * Intenta obtener los roles que coinciden con el ID de rol proporcionado.
   */
  try {
    /**
     * Obtiene el ID de rol del cuerpo de la solicitud.
     * 
     * @type {BodyProps}
     */
    const { userRolID }: BodyProps = request.body

     /**
     * Construye la consulta de obtención de roles.
     */
    const queryString = `
      SELECT * FROM [HDTA025].[dbo].[H025_S_ROL]
      ${userRolID ? `WHERE ROL_COD = '${userRolID}'` : ""}
    `
    
    // const sequelize = await getSequelize()
     /**
     * Ejecuta la consulta de obtención de roles.
     */
    const [data] = await sequelize.query(queryString) as [S_ROL[], unknown]

    /**
     * Devuelve una respuesta exitosa con los roles obtenidos.
     */
    response.status(200).json(data);

  } catch (error) {
    /**
     * Devuelve una respuesta de error con un código de estado 500.
     */
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default rolsHandler;