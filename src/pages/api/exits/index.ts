// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { format } from 'date-fns';
import getDestinationEntryQuery from "@/utils/api/aboutToLeave";
import { ORIGIN_BY_DESTINATION } from "@/lib/enums";
import axios from "axios";
import { splitString } from "@/utils/splitString";
import { getDriver, getVehicule } from "@/services/transportInfo";

/**
 * Tipo de objeto que representa el cuerpo de la solicitud para obtener salidas.
 * 
 * @property {string} dateFrom - Fecha de inicio para filtrar las salidas.
 * @property {string} dateTo - Fecha de fin para filtrar las salidas.
 * @property {T_CON["CON_CED"]} cedula - Número de cédula del conductor.
 * @property {T_VEH["VEH_PLA"]} plate - Placa del vehículo.
 * @property {P_ENT["ENT_NUM"]} entryNumber - Número de entrada relacionada con la salida.
 */
export type GetExitsBodyProps = {
  dateFrom: string;
  dateTo: string;
  cedula: T_CON["CON_CED"],
  plate: T_VEH["VEH_PLA"],
  entryNumber: P_ENT["ENT_NUM"],
}

const base_url = process.env.NEXT_PUBLIC_AAD_REDIRECT_ID

/**
 * Manejador de solicitudes para obtener salidas.
 * 
 * @param {NextApiRequest} NextApiRequest - La solicitud entrante.
 * @param {NextApiResponse} NextApiResponse - La respuesta saliente.
 */
const exitsHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    //Inicializa un arreglo vacío para almacenar las salidas.
    let exits: Exit[] = []
    //Obtiene los parámetros de la solicitud desde el cuerpo de la solicitud.
    const { dateFrom, dateTo, plate, cedula, entryNumber }: GetExitsBodyProps = request.body
    //Función para obtener las salidas según los parámetros de la solicitud.

    /**
     * Función para obtener las salidas según los parámetros de la solicitud.
     * 
     * @returns {Promise<(P_ENT & P_SAL)[]>} - Arreglo de objetos que representan las salidas.
     */
    const getExits = async () => {
      //Inicializa variables para almacenar el vehículo y el conductor.
      let vehicule: Vehicule | undefined
      let driver: Driver | undefined

      // Busca el vehículo y el conductor según los parámetros de la solicitud.
      if (plate) {
        vehicule = await getVehicule(plate, "VEH_PLA")
      }

      if (cedula) {
        driver = await getDriver(cedula, "CON_CED")
      }
      //Construye un arreglo de opciones para la consulta.
      // Se coloca todas las opciones en un array para que todas sean opcionales, luego se coloca el WHERE y el AND
      const options = [
        dateFrom && `'${dateFrom}' <= SAL_FEC`,
        dateTo && `SAL_FEC <= '${dateTo}'`,
        entryNumber && `ent.ENT_NUM = '${entryNumber}'`,
        vehicule ? `VEH_ID = '${vehicule.id}'` : "",
        driver ? `CON_COD = '${driver.code}'` : "",
      ];

      //Construye la consulta para obtener las salidas según los parámetros de la solicitud.
      // Buscando las salidas por las fechas
      const exitsQuery = `
        SELECT *
        FROM H025_P_ENT AS ent
        INNER JOIN H025_P_SAL AS sal ON ent.ENT_NUM = sal.ENT_NUM
        ${options.reduce((accumulator, field, index) => {
          if (field) {
            return `${accumulator} ${!accumulator.includes("WHERE") ? `WHERE ${field}` : ` AND ${field}`}`
          } else {
            return accumulator
          }
        }, "")}
        ORDER BY SAL_FEC DESC;
      `
      //Ejecuta la consulta y devuelve el resultado.
      const [exits] = await sequelize.query(exitsQuery) as [(P_ENT & P_SAL)[], unknown]
      return exits
    }

    /**
     * Función para obtener las entradas relacionadas con las salidas.
     * 
     * @param {string[]} entryNumbers - Arreglo de números de entrada relacionados con las salidas.
     * @returns {Promise<P_ENT[]>} - Arreglo de objetos que representan las entradas relacionadas con las salidas.
     */
    const getEntriesByExits = async (entryNumbers: string[]) => {
      //Construye la consulta para obtener las entradas relacionadas con las salidas.

      const queryString2 = `
        SELECT * FROM [HDTA025].[dbo].H025_P_ENT
        WHERE ENT_NUM IN (${entryNumbers})
      `
      //Ejecuta la consulta y devuelve el resultado.
      const [entries] = await sequelize.query(queryString2) as [P_ENT[], unknown]
      return entries;
    }

    //Ejecutamos la funcion para obtener las salidas y las guardamos en una variable
    const dbExits = await getExits()

    if (dbExits.length) {
      // Si hay datos en dbExits, entonces ejecuta el código dentro de este bloque

      // entryNumbers es un arreglo de números de entrada (ENT_NUM) extraídos de dbExits
      // getEntriesByExits es una función que busca entradas en la base de datos utilizando los números de entrada
      // entries es un arreglo de objetos que contiene las entradas encontradas
      const entryNumbers = dbExits.map(({ ENT_NUM }) => ENT_NUM)
      const entries = await getEntriesByExits(entryNumbers)

      for (const { ENT_NUM, CON_COD, VEH_ID, DES_COD, OPE_COD, ENT_FEC, ENT_PES_TAR, USU_LOG, ENT_FLW, ENT_FLW_ACC } of entries) {
        try {
          // Procesar cada entrada encontrada
          const destinationQuery = getDestinationEntryQuery(DES_COD, ENT_NUM)
          const [data] = await sequelize.query(destinationQuery) as [any[], unknown]

          // getDestinationEntryQuery es una función que devuelve una consulta SQL para buscar el destino de la entrada
          // sequelize.query ejecuta la consulta SQL y devuelve un arreglo de resultados
          // data es un arreglo de objetos que contiene el destino de la entrada

          const entry = data.find((entry) => entry.ENT_NUM === ENT_NUM)
          const exit = dbExits.find((exit) => exit.ENT_NUM === ENT_NUM)
          // entry es el objeto que contiene la entrada encontrada
          // exit es el objeto que contiene la salida correspondiente a la entrada

          const ENT_ENTRY = entries.find(({ ENT_NUM }) => entry.ENT_NUM === ENT_NUM)
          console.log('ENT_OBS', ENT_ENTRY?.ENT_OBS)

          // getDriver y getVehicule son funciones que buscan el driver y el vehículo asociados a la entrada
          const driver = await getDriver(CON_COD, "CON_COD")
          const vehicule = await getVehicule(VEH_ID, "VEH_ID")


          //Crear el objeto de salida con inormacion detallada
          exits.push({
            entryNumber: ENT_NUM,
            driver,
            vehicule,
            action: ENT_FLW_ACC,
            destination: DES_COD,
            entryDate: ENT_FEC,
            exitDate: exit?.SAL_FEC || "",
            origin: entry[ORIGIN_BY_DESTINATION[DES_COD]] || "",
            truckWeight: ENT_PES_TAR,
            grossWeight: exit?.SAL_PES_BRU || 0,
            calculatedNetWeight: (entry.ENT_DI_PNC === null) ? 0 : entry.ENT_DI_PNC,
            netWeight: exit?.ENT_PES_NET || 0,
            operation: OPE_COD,
            invoice: null,
            entryDetails: splitString(ENT_ENTRY?.ENT_OBS || ""),
            distDetails: entry?.ENT_DI_OBS || "",
            exitDetails: exit?.SAL_OBS || "",
            weightDifference: 0,
            palletWeight: entry.ENT_DI_PPA,
            palletsQuatity: entry.ENT_DI_CPA,
            aditionalWeight: entry.ENT_DI_PAD,
            userAccountName: ENT_ENTRY?.USU_LOG || "",
            aboutToLeave: Boolean(ENT_FLW === 2),
          })
        } catch (error) {
          console.error(error)
        }
      }

    }

    // Me ordena las salidas de la más reciente a la más antigua.
    exits = exits.sort((a, b) => {
      if (a.exitDate < b.exitDate) {
        return -1;
      } else if (a.exitDate > b.exitDate) {
        return 1;
      }
      return 0;
    }).reverse()

    response.status(200).json(exits);

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default exitsHandler;

// Crear un vehículo en SQL con ORI_ID = 1
// Crear un vehículo en JDE con la misma placa
// Correr el JOB.
// Ver la tabla de SQL