import sequelize from "@/lib/mssql";
import { CHARGE_PLAN_NOT_FOUND } from "@/utils/services/errorMessages";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * El tipo `BodyProps` define una interfaz TypeScript con una propiedad `chargePlan` de tipo número.
 * @property {number} chargePlan: la propiedad `chargePlan` en el tipo `BodyProps` representa una
 * número que  indica un plan de carga.
 */
type BodyProps = {
  chargePlan: number,
}

/**
 * La función `testHandler` es una función asíncrona que recupera información sobre un cargo
 * planifica desde una base de datos y lo devuelve como respuesta JSON, manejando los errores de manera adecuada.
 * Solicitud @param {NextApiRequest} NextApiRequest: el parámetro `request` en la función `testHandler` es de tipo
 * `NextApiRequest`, que es una interfaz proporcionada por Next.js para manejar solicitudes de API. Contiene
 * información sobre la solicitud HTTP entrante, como encabezados, cuerpo, parámetros de consulta, etc.
 * @param {NextApiResponse} response: el parámetro `respuesta` en la función `testHandler` es un
 * objeto que representa la respuesta HTTP que se enviará al cliente. Tiene métodos como
 * `status()` para establecer el código de estado HTTP de la respuesta y `json()` para enviar una respuesta JSON a
 * el cliente.
 */
const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const { chargePlan }: BodyProps = request.body

    // Trae el plan de carga y su peso asignado
    const queryString1 = `
      SELECT * FROM OPENQUERY(JDE, '
        SELECT LLLDNM, LLSCWT FROM PRODDTA.F4961
        WHERE LLLDNM IN (''${chargePlan}'')
        ORDER BY LLLDNM DESC
      ')
    `

    // Trae el plan de carga y su destino asignado
    const queryString2 = `
      SELECT * FROM OPENQUERY(JDE, '
        SELECT TMLDNM, TMCTY1 FROM PRODDTA.F4960
        WHERE TMLDNM IN (''${chargePlan}'')
        ORDER BY TMLDNM DESC
      ')
    `

    // const sequelize = await getSequelize()

    /* Este fragmento de código ejecuta consultas de base de datos utilizando Sequelize para obtener información sobre un
    plan de carga. Aquí hay un desglose de lo que está haciendo:
    *Guarda en data1 y en data2 los resultados de las consultas anteriores a la base de datos
    *El if verifica que los resultados no sean vacios 
    *Se declara una constante del tipo ChargePLanInfo con la informacion extraida de la base de datos y se asigna como respuesta
    *En caso de que no consiga el plan de carga regresa CHARGE_PLAN_NOT_FOUND
    */
    const [data1] = await sequelize.query(queryString1) as [F4961[], unknown]
    const [data2] = await sequelize.query(queryString2) as [F4960[], unknown]

    if (data1.length && data2.length) {


/* El fragmento de código `const chargePlanInfo: ChargePlanInfo = {... }` está creando un objeto llamado
`chargePlanInfo` de tipo `ChargePlanInfo`. Extrae datos específicos de los resultados de
consultas de bases de datos (`data1` y `data2`) y las asigna a propiedades del objeto `chargePlanInfo`:
*/
      const chargePlanInfo: ChargePlanInfo = {
        number: data1[0].LLLDNM,
        weight: parseFloat((data1[0].LLSCWT / 10000).toFixed(2)),
        destination: data2[0].TMCTY1,
      }

      response.status(200).json(chargePlanInfo);

    } else {
      response.status(400).json({
        message: CHARGE_PLAN_NOT_FOUND
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