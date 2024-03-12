import { ORIGIN_BY_DESTINATION } from "@/lib/enums";
import getSequelize from "@/lib/mssql";
import getDestinationEntryQuery from "@/utils/api/aboutToLeave";
import { NextApiRequest, NextApiResponse } from "next";

const aboutToLeaveHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {

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

    const sequelize = await getSequelize()

    const [data] = await sequelize.query(queryString1) as [P_ENT[], unknown]

    const entryNums = data.map(({ ENT_NUM }) => ENT_NUM)
    const vehiculeIDs = data.map(({ VEH_ID }) => VEH_ID)
    const driversIDs = data.map(({ CON_COD }) => CON_COD)

    // Trae la información de cada vehículo que está dentro de la empresa
    const queryString2 = `
      SELECT * FROM H025_T_VEH WHERE VEH_ID IN (
        ${vehiculeIDs}
      ) 
    `

    // Trae la información de los conductores de los vehículos
    const queryString3 = `
      SELECT * FROM H025_T_CON WHERE CON_COD IN (
        ${driversIDs}
      )
    `
    
    const destinationCodes: DES_COD[] = ["D01", "D02", "D03", "D04", "D05", "D07"]
    
    const a = await destinationCodes.map(async (DES_CODE)=>{
      return data
    })

    const [vehicules] = await sequelize.query(queryString2) as [T_VEH[], unknown]
    const [drivers] = await sequelize.query(queryString3) as [T_CON[], unknown]

    const entries: Entry[] = []
    
    for (const { ENT_NUM, CON_COD, VEH_ID, DES_COD, OPE_COD, ENT_FEC, ENT_PES_TAR } of data) {
      
      const vehicule = vehicules.find((vehicule) => vehicule.VEH_ID === VEH_ID)
      const driver = drivers.find((driver) => driver.CON_COD === CON_COD)
      
      const destinationQuery = getDestinationEntryQuery(DES_COD, ENT_NUM)
      
      const [data] = await sequelize.query(destinationQuery) as [any[], unknown]
      
      const entry = data.find((entry) => entry.ENT_NUM === ENT_NUM)
      
      entries.push({
        entryNumber: ENT_NUM,
        driver: {
          name: driver?.CON_NOM || "",
          cedula: driver?.CON_CED || "",
          code: driver?.CON_COD || "",
        },
        vehicule: {
          id: VEH_ID,
          plate: vehicule?.VEH_PLA || "",
          model: vehicule?.VEH_MOD || "",
          type: vehicule?.VEH_TIP || "",
          capacity: vehicule?.VEH_CAP || 0,
          company: vehicule?.TRA_COD || "",
        },
        destination: DES_COD,
        entryDate: ENT_FEC,
        origin: entry[ORIGIN_BY_DESTINATION[DES_COD]] || "",
        truckWeight: ENT_PES_TAR,
        grossWeight: (entry.ENT_DI_PNC === null) ? 0 : entry.ENT_DI_PNC,
        netWeight: (entry.ENT_DI_PNC === null) ? 0 : entry.ENT_DI_PNC,
        operation: OPE_COD,
        details: "",
      }) 
    }
  
    response.json(entries)

  } catch (error) {
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    })
  }
}

export default aboutToLeaveHandler;