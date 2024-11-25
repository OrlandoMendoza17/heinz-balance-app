import { NewExit } from "@/components/pages/VehiculesExit";
import { DESTINATION_TABLES, ORIGIN_BY_DESTINATION } from "@/lib/enums";
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { getInsertAttributes } from "@/utils/api/insert";
import { getUPDATEValues } from "@/utils/api/update";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Propiedades del cuerpo de la petición para crear una nueva salida.
 * @property {NewExit} leavingEntry - Información de la salida que se está creando.
 * @property {object | undefined} updateEntryByDestination - Información adicional para actualizar la entrada por destino (opcional).
 * @property {DES_COD} destination - Código de destino de la salida.
 */
export type NewExitParamsBodyProps = {
  leavingEntry: NewExit,
  updateEntryByDestination: object | undefined,
  destination: DES_COD,
}

/**
 * Maneja una nueva solicitud de salida.
 * 
 * Esta función es un punto de entrada de API que crea una nueva entrada de salida en la base de datos
 * y opcionalmente actualiza una entrada existente en la tabla de destino.
 * 
 * @param {NextApiRequest} NextApiRequest - El objeto de solicitud entrante.
 * @param {NextApiResponse} NextApiResponse - El objeto de respuesta para enviar de vuelta al cliente.
 */
const newExitHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  //Inicia una nueva transacción de base de datos para asegurar la atomicidad.
  const transaction = await sequelize.transaction()
  try {
    //Extrae los parámetros del cuerpo de la solicitud.
    const { leavingEntry, updateEntryByDestination, destination }: NewExitParamsBodyProps = request.body

    console.log('leavingEntry', leavingEntry)

    //Prepara los atributos de inserción para la entrada de salida.
    const [keys, values] = getInsertAttributes(leavingEntry)
    
    //Construye la cadena de consulta de inserción.
    const queryString1 = `
      INSERT H025_P_SAL\n${keys} 
      VALUES ${values}
    `
    //Ejecuta la consulta de inserción.
    await sequelize.query(queryString1)
    
    //Si updateEntryByDestination es verdadero, actualiza la entrada correspondiente en la tabla de destino.
    if (updateEntryByDestination) {

      // Prepara los valores de actualización para la entrada de destino
      const values = getUPDATEValues(updateEntryByDestination)

      //Construye la cadena de consulta de actualización.
      const queryString2 = `
        UPDATE H025_P_${DESTINATION_TABLES[destination]}
        SET
          ${values}
        WHERE ENT_NUM = ${leavingEntry.ENT_NUM};
      `
      //Ejecuta la consulta de actualización.
      await sequelize.query(queryString2)
    }

    //Confirma la transacción de base de datos.
    await transaction.commit()

    response.status(201).json({
      message: "Created Succesfully",
    })

  } catch (error) {
    //Reversa la transacción de base de datos en caso de error.
    await transaction.rollback();
    console.log(error)
    //Devuelve una respuesta de error al cliente.
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default newExitHandler;