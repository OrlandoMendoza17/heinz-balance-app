// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { format } from 'date-fns';
import getDestinationEntryQuery from "@/utils/api/aboutToLeave";
import { ORIGIN_BY_DESTINATION } from "@/lib/enums";
import axios from "axios";
import { splitString } from "@/utils/splitString";

export type GetExitsBodyProps = {
  dateFrom: string;
  dateTo: string;
  cedula: T_CON["CON_CED"],
  plate: T_VEH["VEH_PLA"],
  entryNumber: P_ENT["ENT_NUM"],
}

const base_url = process.env.NEXT_PUBLIC_AAD_REDIRECT_ID

const exitsHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const searchVehiculesDrivers = async (entries: P_ENT[]) => {
      const vehiculeIDs = entries.map(({ VEH_ID }) => VEH_ID)
      const driversIDs = entries.map(({ CON_COD }) => CON_COD)

      // Trae la información de cada vehículo que está dentro de la empresa
      const queryString = `
        SELECT * FROM H025_T_VEH WHERE VEH_ID IN (
          ${vehiculeIDs}
        ) 
      `

      // Trae la información de los conductores de los vehículos
      const queryString2 = `
        SELECT * FROM H025_T_CON WHERE CON_COD IN (
          ${driversIDs}
        )
      `
      const [vehicules] = await sequelize.query(queryString) as [T_VEH[], unknown]
      const [drivers] = await sequelize.query(queryString2) as [T_CON[], unknown]

      return { vehicules, drivers }
    }

    let exits: Exit[] = []
    const { dateFrom, dateTo, plate, cedula, entryNumber }: GetExitsBodyProps = request.body

    const getExits = async () => {

      let vehicule: T_VEH[] = []
      let driver: T_CON[] = []

      if (plate) {
        const vehiculeQuery = `
          SELECT * FROM H025_T_VEH
          WHERE VEH_PLA = '${plate}'
        `
        const [data1] = await sequelize.query(vehiculeQuery) as [T_VEH[], unknown]
        vehicule = data1
      }

      if (cedula) {
        const driverQuery = `
          SELECT * FROM H025_T_CON
          WHERE CON_CED = '${cedula}'
        `
        const [data2] = await sequelize.query(driverQuery) as [T_CON[], unknown]
        driver = data2
      }

      // Se coloca todas las opciones en un array para que todas sean opcionales, luego se coloca el WHERE y el AND
      const options = [
        dateFrom && `'${dateFrom}' <= SAL_FEC`,
        dateTo && `SAL_FEC <= '${dateTo}'`,
        entryNumber && `ent.ENT_NUM = '${entryNumber}'`,
        vehicule[0] && `VEH_ID = '${vehicule[0].VEH_ID}'`,
        driver[0] && `CON_COD = '${driver[0].CON_COD}'`,
      ];

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
      const [exits] = await sequelize.query(exitsQuery) as [(P_ENT & P_SAL)[], unknown]
      return exits
    }

    const getEntriesByExits = async (entryNumbers: string[]) => {
      const queryString2 = `
        SELECT * FROM [HDTA025].[dbo].H025_P_ENT
        WHERE ENT_NUM IN (${entryNumbers})
      `
      const [entries] = await sequelize.query(queryString2) as [P_ENT[], unknown]
      return entries;
    }

    const dbExits = await getExits()

    if (dbExits.length) {

      const entryNumbers = dbExits.map(({ ENT_NUM }) => ENT_NUM)

      const entries = await getEntriesByExits(entryNumbers)

      const { vehicules, drivers } = await searchVehiculesDrivers(entries)

      for (const { ENT_NUM, CON_COD, VEH_ID, DES_COD, OPE_COD, ENT_FEC, ENT_PES_TAR, ENT_FLW, ENT_FLW_ACC } of entries) {

        const vehicule = vehicules.find((vehicule) => vehicule.VEH_ID === VEH_ID)
        // const driver = drivers.find((driver) => driver.CON_COD === CON_COD)

        // const vehiculeBody = {vehiculeID: VEH_ID, field: "VEH_ID"}
        // const vehicule = (await axios.post<Vehicule>(`${base_url}/api/vehicules`, vehiculeBody)).data
        
        const driverBody = { driverID: CON_COD, field: "CON_COD" }
        const driver = (await axios.post<Driver>(`${base_url}/api/drivers`, driverBody)).data
        
        const destinationQuery = getDestinationEntryQuery(DES_COD, ENT_NUM)

        // Trae la información de los transportes de los vehículos
        const transportQuery = `
          SELECT * FROM H025_T_TRA 
          WHERE TRA_COD = ${vehicule?.TRA_COD}
        `

        const [transports] = await sequelize.query(transportQuery) as [T_TRA[], unknown]

        const [data] = await sequelize.query(destinationQuery) as [any[], unknown]

        const entry = data.find((entry) => entry.ENT_NUM === ENT_NUM)
        const exit = dbExits.find((exit) => exit.ENT_NUM === ENT_NUM)

        const ENT_ENTRY = entries.find(({ ENT_NUM }) => entry.ENT_NUM === ENT_NUM)

        console.log('ENT_OBS', ENT_ENTRY?.ENT_OBS)

        exits.push({
          entryNumber: ENT_NUM,
          driver,
          vehicule: {
            id: VEH_ID,
            plate: vehicule?.VEH_PLA || "",
            model: vehicule?.VEH_MOD || "",
            type: vehicule?.VEH_TIP || "",
            capacity: vehicule?.VEH_CAP || 0,
            company: transports[0]?.TRA_NOM || "",
            companyID: transports[0]?.TRA_COD || "",
            originID: vehicule?.ORI_ID || 0,
          },
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
          aboutToLeave: Boolean(ENT_FLW === 2),
        })
      }
    }
    
    // Me ordena las salidas de la más reciente a la más antigua.
    exits = exits.sort((a, b)=>{
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