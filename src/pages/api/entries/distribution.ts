// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { format } from 'date-fns';
import { distEntriesExamples, entriesExamples } from "@/utils/examples";

type BodyProps = {
    entriesType: "entry" | "initial" | "dispatch" | "aboutToLeave" | "all";
    formatted: boolean,
};

const isDistInitialEntry = (distEntry: P_ENT_DI) => {
    const { ENT_DI_GUI, ENT_DI_PLA, ENT_DI_NDE } = distEntry
    return !(
        Boolean(ENT_DI_GUI) &&
        Boolean(ENT_DI_PLA) &&
        Boolean(ENT_DI_NDE)
    )
}

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

        const [data1] = await sequelize.query(queryString) as [P_ENT[], unknown]
        // const data1: P_ENT[] = entriesExamples

        if (data1.length) {
            
            const distributionIDS = data1.map(({ ENT_NUM }) => ENT_NUM)
            // const distributionIDS = ['95557', '95555', '95552', '95551']

            const entryDistIDS = data1.filter(({ ENT_FLW }) => ENT_FLW === 1).map(({ ENT_NUM }) => ENT_NUM)
            const aboutToLeaveDistIDS = data1.filter(({ ENT_FLW }) => ENT_FLW === 2).map(({ ENT_NUM }) => ENT_NUM)

            // const entryDistIDS = ['95557', '95555', '95552', '95551']
            // const aboutToLeaveDistIDS: string[] = []

            const queryString2 = `
                SELECT * FROM H025_P_ENT_DI
                WHERE ENT_NUM IN (${distributionIDS})
                ORDER BY ENT_NUM DESC
            `

            const [entries] = await sequelize.query(queryString2) as [P_ENT_DI[], unknown]
            // const entries = distEntriesExamples
            
            const distribution = {
                entry: 
                    entries.filter(({ ENT_NUM }) => entryDistIDS.includes(ENT_NUM))
                ,
                initial: 
                    entries.filter((distEntry) => {
                        return isDistInitialEntry(distEntry)
                    })
                ,
                dispatch: 
                    entries.filter((distEntry) => {
                        const { ENT_NUM } = distEntry
                        return (
                            !isDistInitialEntry(distEntry) &&      // Valida que no es una entrada que acaba de entrar a distribución
                            !aboutToLeaveDistIDS.includes(ENT_NUM) // Valida que no es una entrada que está por salir de distribución
                        )
                    })
                ,
                aboutToLeave: 
                    entries.filter(({ ENT_NUM }) => aboutToLeaveDistIDS.includes(ENT_NUM))
                ,
                all: entries,
            }

            const distEntries = distribution[entriesType]

            const vehiculeIDs = data1.map(({ VEH_ID }) => VEH_ID)
            const driversIDs = data1.map(({ CON_COD }) => CON_COD)

            // Trae la información de cada vehículo que está dentro de la empresa
            const vehiculesQuery = `
                SELECT * FROM H025_T_VEH WHERE VEH_ID IN (
                    ${vehiculeIDs}
                ) 
            `

            // Trae la información de los conductores de los vehículos
            const driversQuery = `
                SELECT * FROM H025_T_CON WHERE CON_COD IN (
                    ${driversIDs}
                )
            `


            const [vehicules] = await sequelize.query(vehiculesQuery) as [T_VEH[], unknown]
            const [drivers] = await sequelize.query(driversQuery) as [T_CON[], unknown]

            const transportIDs = vehicules.map(({ TRA_COD }) => TRA_COD)

            // Trae la información de los transportes de los vehículos
            const transportsQuery = `
                SELECT * FROM H025_T_TRA WHERE TRA_COD IN (
                    ${transportIDs}
                )
            `

            const [transports] = await sequelize.query(transportsQuery) as [T_TRA[], unknown]

            const formattedEntries: DistributionEntry[] = distEntries.map((distEntry) => {

                const { ENT_NUM, ENT_DI_PRO, ENT_DI_PNC, ENT_DI_DES, ENT_DI_STA, ENT_DI_OBS, ENT_DI_CPA } = distEntry
                const { ENT_DI_PAL, ENT_DI_GUI, ENT_DI_PLA, ENT_DI_NDE, ENT_DI_PPA, ENT_DI_PAD, ENT_DI_DPA, ENT_DI_AUT } = distEntry

                const { VEH_ID, CON_COD, ENT_FEC, ENT_PES_TAR, ENT_FLW, ENT_OBS } = data1.find((item) => item.ENT_NUM === ENT_NUM) as P_ENT

                const vehicule = vehicules.find((vehicule) => vehicule.VEH_ID === VEH_ID)
                const driver = drivers.find((driver) => driver.CON_COD === CON_COD)
                const transport = transports.find((transport) => transport.TRA_COD === vehicule?.TRA_COD)

                return {
                    entryNumber: ENT_NUM,
                    entryDate: ENT_FEC,
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
                        company: transport?.TRA_NOM || "",
                    },
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
                }
            })

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

