import { ORIGIN_BY_DESTINATION } from "@/lib/enums";
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { getDriver, getVehicule } from "@/services/transportInfo";
import getDestinationEntryQuery from "@/utils/api/aboutToLeave";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const base_url = process.env.NEXT_PUBLIC_AAD_REDIRECT_ID

/**
 * Handler para obtener la lista de vehículos que están a punto de salir de la empresa.
 * 
 * @param {NextApiRequest} request - La solicitud HTTP.
 * @param {NextApiResponse} response - La respuesta HTTP.
 */
const aboutToLeaveHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    // Consulta SQL para obtener todas las entradas de vehículos dentro de la empresa que se registraron en balanza.
    // La consulta selecciona varias columnas de la tabla `H025_P_ENT` y se une con la tabla `H025_P_SAL`
    // para obtener solo las entradas que no tienen una salida asociada. El resultado se ordena en orden descendente por número de entrada.
    
    // Trae todas las entradas de vehículos dentro de la empresa que se registraron en balanza
    const queryString1 = `
      SELECT 
        H025_P_ENT.ENT_NUM,
        H025_P_ENT.ENT_FEC,
        H025_P_ENT.USU_LOG,
        H025_P_ENT.VEH_ID,
        H025_P_ENT.CON_COD,
        H025_P_ENT.DES_COD,
        H025_P_ENT.OPE_COD,
        H025_P_ENT.ENT_PES_TAR,
        H025_P_ENT.EMP_ID,
        H025_P_ENT.ENT_OBS,
        H025_P_ENT.ENT_FLW,
        H025_P_ENT.ENT_FEC_COL,
        H025_P_ENT.ENT_FLW_ACC
      FROM H025_P_ENT
      LEFT JOIN H025_P_SAL ON H025_P_ENT.ENT_NUM = H025_P_SAL.ENT_NUM
      WHERE H025_P_SAL.ENT_NUM IS NULL
      ORDER BY ENT_NUM DESC;
    `

    // const sequelize = await getSequelize()
    // Ejecuta la consulta SQL y obtiene el resultado.
    // El resultado es un arreglo de objetos que representan las entradas de vehículos dentro de la empresa.
    
    const [entries] = await sequelize.query(queryString1) as [P_ENT[], unknown]

    // Extrae los IDs de vehículos y conductores de las entradas.
    const vehiculeIDs = entries.map(({ VEH_ID }) => VEH_ID)
    const driversIDs = entries.map(({ CON_COD }) => CON_COD)

    // Consulta SQL para obtener la información de cada vehículo que está dentro de la empresa.
    // Trae la información de cada vehículo que está dentro de la empresa
    const queryString2 = `
      SELECT * FROM H025_T_VEH WHERE VEH_ID IN (
        ${vehiculeIDs}
      ) 
    `
    // Consulta SQL para obtener la información de los conductores de los vehículos.
    // Trae la información de los conductores de los vehículos
    const queryString3 = `
      SELECT * FROM H025_T_CON WHERE CON_COD IN (
        ${driversIDs}
      )
    `
    // Ejecuta la consulta SQL para obtener la información de los vehículos y obtiene el resultado.
    const [vehicules] = await sequelize.query(queryString2) as [T_VEH[], unknown]

    // Inicializa un arreglo para almacenar los datos de salida.
    const exits: Exit[] = []

    // Itera sobre las entradas y obtiene la información adicional necesaria para cada una.
    for (const { ENT_NUM, CON_COD, VEH_ID, DES_COD, OPE_COD, ENT_FEC, ENT_PES_TAR, ENT_FLW, ENT_FLW_ACC } of entries) {

      const destinationQuery = getDestinationEntryQuery(DES_COD, ENT_NUM)
      
      try {
        // Agrega la información de la entrada a la lista de salidas
        const [data] = await sequelize.query(destinationQuery) as [any[], unknown]
        
        const entry = data.find((entry) => entry.ENT_NUM === ENT_NUM)
        
        const ENT_ENTRY = entries.find(({ ENT_NUM }) => entry.ENT_NUM === ENT_NUM)
        
        console.log('ENT_OBS', ENT_ENTRY?.ENT_OBS)
        
        const vehicule = await getVehicule(VEH_ID, "VEH_ID")
        const driver = await getDriver(CON_COD, "CON_COD")
        
        exits.push({
          entryNumber: ENT_NUM,
          driver,
          vehicule,
          action: ENT_FLW_ACC,
          destination: DES_COD,
          entryDate: ENT_FEC,
          exitDate: "",
          origin: entry[ORIGIN_BY_DESTINATION[DES_COD]] || "",
          truckWeight: ENT_PES_TAR,
          grossWeight: 0,
          calculatedNetWeight: (entry.ENT_DI_PNC === null) ? 0 : entry.ENT_DI_PNC,
          netWeight: 0,
          operation: OPE_COD,
          invoice: entry?.ENT_MP_FAC || entry?.ENT_SG_FAC || entry?.ENT_ALM_FAC || null,
          entryDetails: ENT_ENTRY?.ENT_OBS || "",
          distDetails: entry?.ENT_DI_OBS || "",
          exitDetails: "",
          weightDifference: 0,
          palletWeight: entry.ENT_DI_PPA,
          palletsQuatity: entry.ENT_DI_CPA,
          aditionalWeight: entry.ENT_DI_PAD,
          userAccountName: ENT_ENTRY?.USU_LOG || "",
          aboutToLeave: Boolean(ENT_FLW === 2),
        })
        
      } catch (error) {
        console.log(error)        
      }
    }

    // Devuelve la respuesta HTTP con la lista de salidas.
    response.json(exits)

  } catch (error) {
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    })
  }
}

export default aboutToLeaveHandler;