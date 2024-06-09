// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

export type SearchUserBy = Partial<Pick<User, "email" | "ficha" | "cedula" | "accountName">>
/**
 * Manejador de búsqueda de usuarios.
 * 
 * @param {NextApiRequest} request - Request de Next.js.
 * @param {NextApiResponse} response - Response de Next.js.
 * 
 * @returns {Promise<void>} Promesa que se resuelve cuando se completa la búsqueda de usuarios.
 */
const usersHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
   /**
   * Obtiene los parámetros de búsqueda del cuerpo de la solicitud.
   * 
   * @type {SearchUserBy}
   */
  const { email, ficha, cedula, accountName }: SearchUserBy = request.body
   /**
   * Intenta buscar los usuarios que coinciden con los parámetros de búsqueda.
   */
  try {
    /**
     * Construye la consulta de búsqueda de usuarios.
     */
    const options = [
      email ? `USU_MAI = '${email}'` : "",
      ficha ? `USU_FIC = ${ficha}` : "",
      cedula ? `USU_CED = '${cedula}'` : "",
      accountName ? `USU_LOG = '${accountName}'` : "",
    ]
    
    const queryString = `
      SELECT * FROM [HDTA025].[dbo].[H025_S_USU]
      ${options.reduce((accumulator, field, index) => {
      if (field) {
        return `${accumulator} ${!accumulator.includes("WHERE") ? `WHERE ${field}` : ` OR ${field}`}`
      } else {
        return accumulator
      }
    }, "")
      }
    `
    /**
     * Ejecuta la consulta de búsqueda de usuarios.
     */
    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [S_USU[], unknown]

     /**
     * Transforma los resultados de la consulta en un arreglo de usuarios.
     */
    const users: User[] = data.map((user) => {
      return {
        nombre: user.USU_NOM,
        email: user.USU_MAI,
        ficha: user.USU_FIC,
        cedula: user.USU_CED,
        rol: user.ROL_COD,
        accountName: user.USU_LOG,
        status: Boolean(user.USU_STA),
      }
    })

    //Devuelve una respuesta exitosa con un codigo de estado 200
    response.status(200).json(users);

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

export default usersHandler;