// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { getDriver, getVehicule } from "@/services/transportInfo";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  entriesType: "entry" | "initial" | "dispatch" | "aboutToLeave" | "all";
  formatted: boolean,
};

// Si ninguno de estos 3 valores está es porque el vehículo está en entrada
const isDistInitialEntry = (distEntry: P_ENT_DI) => {
  const { ENT_DI_GUI, ENT_DI_PLA, ENT_DI_NDE } = distEntry
  return !(
    Boolean(ENT_DI_GUI) &&
    Boolean(ENT_DI_PLA) &&
    Boolean(ENT_DI_NDE)
  )
}

const base_url = process.env.NEXT_PUBLIC_AAD_REDIRECT_ID

const distributionHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {

    const { entriesType, formatted }: BodyProps = request.body

    // const sequelize = await getSequelize()

    const queryString = `
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
      AND DES_COD ='D01'
      ORDER BY ENT_NUM DESC;
    `

    const [entries] = await sequelize.query(queryString) as [P_ENT[], unknown]
    // const entries: P_ENT[] = entriesExamples

    if (entries.length) {

      const distributionIDS = entries.map(({ ENT_NUM }) => ENT_NUM)
      // const distributionIDS = ['95557', '95555', '95552', '95551']

      // ENT_FLW = 1 -> Es porque la entrada está en proceso de distribución
      // ENT_FLW = 2 -> Es porque la entrada está por salir
      const entryDistIDS = entries.filter(({ ENT_FLW }) => ENT_FLW === 1).map(({ ENT_NUM }) => ENT_NUM)
      const aboutToLeaveDistIDS = entries.filter(({ ENT_FLW }) => ENT_FLW === 2).map(({ ENT_NUM }) => ENT_NUM)

      // const entryDistIDS = ['95557', '95555', '95552', '95551']
      // const aboutToLeaveDistIDS: string[] = []

      const queryString2 = `
        SELECT * FROM H025_P_ENT_DI
        WHERE ENT_NUM IN (${distributionIDS})
        ORDER BY ENT_NUM DESC
      `

      let [distEntries] = await sequelize.query(queryString2) as [P_ENT_DI[], unknown]

      const distribution = {
        entry:
          distEntries.filter(({ ENT_NUM }) =>
            entryDistIDS.includes(ENT_NUM) &&
            !aboutToLeaveDistIDS.includes(ENT_NUM) // Valida que no es una entrada que está por salir de distribución
          )
        ,
        initial:
          distEntries.filter((distEntry) =>
            isDistInitialEntry(distEntry) &&
            !aboutToLeaveDistIDS.includes(distEntry.ENT_NUM) // Valida que no es una entrada que está por salir de distribución
          )
        ,
        dispatch:
          distEntries.filter((distEntry) => {
            const { ENT_NUM } = distEntry
            return (
              !isDistInitialEntry(distEntry) &&      // Valida que no es una entrada que acaba de entrar a distribución
              !aboutToLeaveDistIDS.includes(ENT_NUM) // Valida que no es una entrada que está por salir de distribución
            )
          })
        ,
        aboutToLeave:
          distEntries.filter(({ ENT_NUM }) => aboutToLeaveDistIDS.includes(ENT_NUM))
        ,
        all: distEntries,
      }

      distEntries = distribution[entriesType]

      const formattedEntries: DistributionEntry[] = []

      for (const distEntry of distEntries) {
        const { ENT_NUM, ENT_DI_PRO, ENT_DI_PNC, ENT_DI_DES, ENT_DI_STA, ENT_DI_OBS, ENT_DI_CPA, ENT_DI_REV } = distEntry
        const { ENT_DI_PAL, ENT_DI_GUI, ENT_DI_PLA, ENT_DI_NDE, ENT_DI_PPA, ENT_DI_PAD, ENT_DI_DPA, ENT_DI_AUT } = distEntry

        const entry = entries.find((item) => item.ENT_NUM === ENT_NUM) as P_ENT
        
        const { VEH_ID, CON_COD, ENT_FEC, ENT_PES_TAR, ENT_FLW, ENT_OBS } = entry

        try {

          const vehicule = await getVehicule(VEH_ID, "VEH_ID")
          const driver = await getDriver(CON_COD, "CON_COD")

          formattedEntries.push({
            entryNumber: ENT_NUM,
            entryDate: ENT_FEC,
            driver,
            vehicule,
            origin: ENT_DI_PRO,
            truckWeight: ENT_PES_TAR,
            entryDetails: ENT_OBS,
            calculatedNetWeight: ENT_DI_PNC,
            aboutToLeave: Boolean(ENT_FLW === 2),
            chargeDestination: ENT_DI_DES,
            vehiculeStatus: ENT_DI_STA,
            distDetails: ENT_DI_OBS,
            palletsQuatity: ENT_DI_CPA,
            palletChargePlan: ENT_DI_PAL,
            guideNumber: ENT_DI_GUI,
            chargePlan: ENT_DI_PLA,
            dispatchNote: ENT_DI_NDE,
            palletWeight: ENT_DI_PPA,
            aditionalWeight: ENT_DI_PAD,
            aditionalWeightDescription: ENT_DI_DPA,
            exitAuthorization: ENT_DI_AUT,
            returned: Boolean(ENT_DI_REV)
          })

        } catch (error) {
          console.log('error', error)
        }
      }

      response.status(200).json(formatted ? formattedEntries : distEntries);

    } else {

      response.status(200).json([]);

    }

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default distributionHandler;

