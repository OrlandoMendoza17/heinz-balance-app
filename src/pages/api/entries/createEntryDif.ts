// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInsertAttributes } from "@/utils/api/insert";

type POST_BodyProps = {
  entryDif: Omit<P_ENT_DIF, "ENT_DIF_NUM">,
}

/**
 * Manejador de diferencias de entrada. Recibe una solicitud HTTP y devuelve una respuesta.
 * 
 * @param {NextApiRequest} request La solicitud HTTP.
 * @param {NextApiResponse} response La respuesta HTTP.
 */
const createEntryDifferencesHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    
    // Maneja la solicitud POST para crear una nueva diferencia de entrada.
    const { entryDif }: POST_BodyProps = request.body
    
    const [keys, values] = getInsertAttributes(entryDif)

    //Construye la consulta sql
    const queryString = `
      INSERT H025_P_ENT_DIF\n${keys} 
      VALUES ${values}
    `
    
    // const sequelize = await getSequelize()
    //Ejecuta la consulta sql
    const [data] = await sequelize.query(queryString) as [unknown[], unknown]

    // Devuelve la respuesta HTTP con el resultado de la inserción.
    response.status(200).json(data);

  } catch (error) {
    // Devuelve la respuesta HTTP con un error en caso de fallo.
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default createEntryDifferencesHandler;