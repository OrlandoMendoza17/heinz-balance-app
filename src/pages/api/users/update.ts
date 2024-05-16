// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUPDATEValues } from "@/utils/api/update";

export type UpdateUserBody = {
  email: string,
  userInfo: User,
}

/**
 * Manejador de actualización de usuario.
 * 
 * @param {NextApiRequest} request - Request de Next.js.
 * @param {NextApiResponse} response - Response de Next.js.
 * 
 * @returns {Promise<void>} Promesa que se resuelve cuando se completa la actualización del usuario.
 */
const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
   /**
   * Intenta actualizar el usuario con la información proporcionada.
   */
  try {
    /**
     * Obtiene la información del usuario del cuerpo de la solicitud.
     * 
     * @type {UpdateUserBody}
     */
    const { email, userInfo }: UpdateUserBody = request.body
    /**
     * Crea un objeto que representa el usuario a actualizar.
     */
    const DB_USER: S_USU = {
      USU_NOM: userInfo.nombre,
      USU_MAI: userInfo.email,
      USU_FIC: userInfo.ficha,
      USU_CED: userInfo.cedula,
      ROL_COD: userInfo.rol,
      USU_LOG: userInfo.accountName,
      USU_STA: userInfo.status,
      USU_CLA: null,
    }
    
     /**
     * Obtiene los valores a actualizar del objeto de usuario.
     */
    const values = getUPDATEValues(DB_USER)

    /**
     * Construye la consulta de actualización del usuario.
     */
    const queryString = `
      UPDATE H025_S_USU
      SET	
        ${values}
      WHERE 
        USU_MAI = '${email}'
    `
    
    // console.log(queryString)
    /**
    * Ejecuta la consulta de actualización del usuario.
    */
    await sequelize.query(queryString) as [unknown[], unknown]


    /**
     * Devuelve una respuesta exitosa con un mensaje de éxito.
     */
    response.status(200).json({
      message: "Succesfully updated"
    });

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

export default testHandler;