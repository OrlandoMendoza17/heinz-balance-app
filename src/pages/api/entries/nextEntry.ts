// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};
/**
 * Handler para obtener el próximo número de entrada.
 * 
 * @param {NextApiRequest} NextApiRequest - La solicitud HTTP.
 * @param {NextApiResponse} NextApiResponse - La respuesta HTTP.
 */
const nextEntryHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    // Consulta SQL para obtener el último número de entrada.
    // Selecciona el máximo número de entrada (ENT_NUM) de la tabla H025_P_ENT
    // y ordena los resultados en orden descendente.
    const queryString = `
      SELECT TOP 1 ENT_NUM FROM H025_P_ENT
      ORDER BY ENT_NUM DESC
    `
    
    // const sequelize = await getSequelize()
    //Ejecuta la consulta SQL y obtiene el resultado.
    //El resultado es un array con un objeto que contiene el número de entrada (ENT_NUM).
    const [data] = await sequelize.query(queryString) as [{ENT_NUM: string}[], unknown]

    // Convierte el número de entrada a entero, le suma 1 y lo convierte a cadena.
    // Luego, devuelve la respuesta HTTP con el próximo número de entrada.
    
    response.status(200).json({
      nextEntryNumber: (parseInt(data[0].ENT_NUM) + 1).toString()
    });
    
  } catch (error) {
    //Captura cualquier error que ocurra durante la ejecución del handler.
    //Registra el error en la consola y devuelve una respuesta HTTP con un código de estado 500.
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
  
}

export default nextEntryHandler;