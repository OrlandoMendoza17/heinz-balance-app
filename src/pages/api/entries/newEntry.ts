// import getSequelize from "@/lib/mssql";
import { DESTINATION_TABLES, ORIGIN_BY_DESTINATION } from "@/lib/enums";
import sequelize from "@/lib/mssql";
import { getInsertAttributes } from "@/utils/api/insert";
import { NewEntry } from "@/utils/getTableValues";
import { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  entry: NewEntry,
  entryByDestination: object,
}

/**
 * Handler para crear una nueva entrada.
 * 
 * @param {NextApiRequest} request - La solicitud HTTP.
 * @param {NextApiResponse} response - La respuesta HTTP.
 */
const newEntryHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  // Inicia una transacción en la base de datos.
  const transaction = await sequelize.transaction()
  try {
    // Obtiene el objeto de cuerpo de la solicitud, que contiene la entrada y la entrada por destino.
    // El objeto se desestructura para obtener las propiedades `entry` y `entryByDestination`.

    const { entry, entryByDestination }: BodyProps = request.body

 /**
 * Función para construir la consulta SQL para insertar la entrada en la tabla `H025_P_ENT`.
 * 
 * @returns {string} La consulta SQL para insertar la entrada.
 */
    const getQueryString1 = () => {
      // Obtiene los atributos y valores para insertar en la tabla `H025_P_ENT`
      // utilizando la función `getInsertAttributes`.
      const [keys, values] = getInsertAttributes(entry)


      //  Construye la consulta SQL para insertar la entrada.
      //  La consulta utiliza la sintaxis `INSERT INTO` con los campos especificados
      //  en `keys` y los valores especificados en `values`.
      const queryString = `
        INSERT H025_P_ENT\n${keys} 
        VALUES ${values}
      `


      // Devuelve la consulta SQL construida.
      return queryString;
    }
  /**
 * Devuelve una cadena de consulta para insertar datos en una tabla de destino.
 * 
 * @returns {string} La cadena de consulta para insertar datos.
 */
    const getQueryString2 = () => {
    // Obtiene las claves y valores del objeto entryByDestination.
    // Este objeto se asume que contiene los datos a insertar en la tabla de destino.
   
      const [keys, values] = getInsertAttributes(entryByDestination)

      // Construye la cadena de consulta utilizando las claves y valores.
      // La cadena de consulta es una instrucción INSERT con el nombre de la tabla generado dinámicamente según el objeto DESTINATION_TABLES.
      
      const queryString = `
        INSERT H025_P_${DESTINATION_TABLES[entry.DES_COD]}\n${keys} 
        VALUES ${values}
      `
      //Devuelve la cadena de consulta construida.
      return queryString;
    }

    const queryString1 = getQueryString1()
    const queryString2 = getQueryString2()

    console.log('queryString1', queryString1)
    console.log('queryString2', queryString2)

    // const sequelize = await getSequelize()
    // Ejecuta las consultas SQL para insertar la entrada en la tabla `H025_P_ENT` y en la tabla de destino.
    await sequelize.query(queryString1)
    await sequelize.query(queryString2)

    // Confirma la transacción.
    await transaction.commit()

    // Devuelve una respuesta HTTP con un estado de 201 (Created) y un mensaje de éxito.
    response.status(201).json({
      message: "Created Succesfully",
    })

  } catch (error) {
    // Revoca la transacción en caso de error.
    await transaction.rollback();
    console.log(error)
    // Devuelve una respuesta HTTP con un estado de 500 (Internal Server Error) y un mensaje de error.
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default newEntryHandler;