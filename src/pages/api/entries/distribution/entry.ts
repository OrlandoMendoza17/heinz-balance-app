// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Describe el cuerpo de la solicitud.
 * @property {P_ENT["ENT_NUM"]} entryNumber Numero de entrada 
 */
type BodyProps = {
  entryNumber: P_ENT["ENT_NUM"]
}

/**
 * Maneja una solicitud de prueba.
 * 
 * Esta función es un punto de entrada de API que busca una entrada en la tabla H025_P_ENT_DI
 * según el número de entrada proporcionado en el cuerpo de la solicitud.
 * 
 * @param {NextApiRequest} request - El objeto de solicitud entrante.
 * @param {NextApiResponse} response - El objeto de respuesta para enviar de vuelta al cliente.
 */
const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    //Extrae el número de entrada del cuerpo de la solicitud.
    const { entryNumber }: BodyProps = request.body
    
    if(entryNumber){
      //Construye la consulta SQL para buscar la entrada en la tabla H025_P_ENT_DI.
      const queryString = `
        SELECT * FROM H025_P_ENT_DI
        WHERE ENT_NUM = ${entryNumber}
      `
      // const sequelize = await getSequelize()
      //Ejecuta la consulta SQL y obtiene la entrada correspondiente.
      const distEntry = (await sequelize.query(queryString) as [P_ENT_DI[], unknown])[0][0]
      
      //Devuelve la entrada encontrada con un estado 200.
      response.status(200).json(distEntry);
      
    }else{
      response.status(400).json({
        message: "Bad Request"
      });
    }

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default testHandler;