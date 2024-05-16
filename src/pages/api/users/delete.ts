// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInsertAttributes } from "@/utils/api/insert";

type BodyProps = {
  email: S_USU["USU_MAI"],
}

/**
 * Manejador de eliminación de usuario.
 * 
 * @param {NextApiRequest} request - Request de Next.js.
 * @param {NextApiResponse} response - Response de Next.js.
 * 
 * @returns {Promise<void>} Promesa que se resuelve cuando se completa la eliminación del usuario.
 */
const deleteUserHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
   /**
   * Intenta eliminar el usuario con el correo electrónico proporcionado.
   */
  
  try {
    /**
     * Obtiene el correo electrónico del cuerpo de la solicitud.
     * 
     * @type {BodyProps}
     */

    const { email }: BodyProps = request.body
     /**
     * Construye la consulta de eliminación del usuario.
     */
    const queryString = `
      DELETE FROM [H025_S_USU]
      WHERE USU_MAI = '${email}'
    `
    /**
     * Ejecuta la consulta de eliminación del usuario.
     */
    await sequelize.query(queryString) as [unknown[], unknown]

    /**
     * Devuelve una respuesta exitosa con un cuerpo vacío.
     */
    response.status(200).json({});

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

export default deleteUserHandler;