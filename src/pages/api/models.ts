// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * El tipo `ModelTypes` define dos propiedades: `Modelo` de tipo string y `Tipo` de tipo string.
 * @property {string} Modelo: Modelo representa el modelo de un vehiculo.
 * @property {string} Tipo - La propiedad "Tipo" en el tipo ModelTypes representa el tipo de un vehiculo
 */
type ModelTypes = {
  Modelo: string,
  Tipo: string,
}

/**
 * El tipo `ModelTypesOptions` incluye matrices de cadenas para modelos y tipos.
 * @property {string[]} modelos: la propiedad `models` en el tipo `ModelTypesOptions` representa una
 * matriz de strings que contiene los nombres de diferentes modelos.
 * @property {string[]} tipos: la propiedad `types` en el tipo `ModelTypesOptions` representa una
 * matriz de strings que definen los tipos asociados con el modelo.
 */
export type ModelTypesOptions = {
  models: string[];
  types: string[];
}

/**
 * La función `modelsHandler` recupera datos únicos de modelo y tipo de una tabla de base de datos y los envía
 * como respuesta JSON.
 * Solicitud @param {NextApiRequest} request: el parámetro `request` en la función `modelsHandler` es de tipo
 * `NextApiRequest`, que es un tipo proporcionado por Next.js para manejar solicitudes de API. Este parámetro
 * contiene información sobre la solicitud HTTP entrante, como encabezados, parámetros de consulta y cuerpo
 * datos. Le permite acceder y procesar
 * @param {NextApiResponse} response: el parámetro `respuesta` en la función `modelsHandler` es un
 * objeto que representa la respuesta HTTP que el servidor envía al cliente. es de tipo
 * `NextApiResponse` que es un tipo específico de Next.js para manejar respuestas API. Este objeto tiene
 * métodos como `json()` para enviar datos JSON
 */
const modelsHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    // const sequelize = await getSequelize()
    
    //Consulta sql
    const queryString = `SELECT * FROM [HDTA025].[dbo].[H025_VW_VEH_MOD_COMBO]`
    // Guardando la consulta de sql como un objeto "ModelTypes[]"
    const [data] = await sequelize.query(queryString) as [ModelTypes[], unknown]

    //Guarda los datos tomados en la consulta en las variables respectivas
    const models = [...new Set(data.map(({ Modelo }) => Modelo))]
    const types = [...new Set(data.map(({ Tipo }) => Tipo))]

    const modelTypes: ModelTypesOptions = { models, types }
    //Devuelve la respuesta en un objeto modelTypes
    response.json(modelTypes)

  } catch (error) {
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    })
  }
}

export default modelsHandler;