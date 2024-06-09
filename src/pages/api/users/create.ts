// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInsertAttributes } from "@/utils/api/insert";

type BodyProps = {
  user: User,
}
/**
 * Manejador de creación de usuarios. Recibe una solicitud HTTP y devuelve una respuesta.
 * 
 * @param {NextApiRequest} request La solicitud HTTP.
 * @param {NextApiResponse} response La respuesta HTTP.
 */
const createUserHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    /**
     * Obtiene el objeto de usuario desde el cuerpo de la solicitud.
     */
    const { user }: BodyProps = request.body
    
    /**
     * Crea un objeto de usuario para la base de datos, mapeando las propiedades del objeto de usuario
     * con las columnas de la tabla H025_S_USU.
     */
    const DB_USER: S_USU = {
      USU_NOM: user.nombre,
      USU_MAI: user.email,
      USU_FIC: user.ficha,
      USU_CED: user.cedula,
      ROL_COD: user.rol,
      USU_LOG: user.accountName,
      USU_STA: user.status,
      USU_CLA: null,
    }

    
    /**
     * Obtiene los atributos necesarios para construir la consulta SQL de inserción.
    */
    
    const [keys, values] = getInsertAttributes(DB_USER)
    
     /**
     * Construye la consulta SQL de inserción.
     */
    const queryString = `
      INSERT H025_S_USU\n${keys} 
      VALUES ${values}
    `
    
    // Ejecuta la consulta SQL de inserción.
     
    await sequelize.query(queryString) as [unknown[], unknown]

    // Devuelve una respuesta HTTP con un estado de 200 (OK).
    response.status(200).json({});

  } catch (error) {
     /**
     * Devuelve una respuesta HTTP con un estado de 500 (Error interno del servidor)
     * y un mensaje de error.
     */
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default createUserHandler;