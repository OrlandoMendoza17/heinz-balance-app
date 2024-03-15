// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getSequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { format } from 'date-fns';

type BodyProps = {
    entriesType: "initial" | "dispatch" | "aboutToLeave" | "all";
};

const isDistInitialEntry = (distEntry: P_ENT_DI) => {
    const { ENT_DI_GUI, ENT_DI_PLA, ENT_DI_NDE, ENT_DI_PAL, ENT_DI_OBS } = distEntry
    return (
        Boolean(ENT_DI_GUI) &&
        Boolean(ENT_DI_PLA) &&
        Boolean(ENT_DI_NDE) &&
        Boolean(ENT_DI_PAL) &&
        Boolean(ENT_DI_OBS)
    )
}

const distributionEntriesHandler = async (request: NextApiRequest, response: NextApiResponse) => {
    try {

        const { entriesType }: BodyProps = request.body

        const sequelize = await getSequelize()

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
            WHERE H025_P_SAL.ENT_NUM IS NULL AND DES_COD ='D01'
            ORDER BY ENT_NUM DESC;
        `
        const [data1] = await sequelize.query(queryString) as [P_ENT[], unknown]

        const distributionIDS = data1.filter(({ DES_COD }) => DES_COD === "D01").map(({ ENT_NUM }) => ENT_NUM)

        const queryString2 = `
            SELECT * FROM P_ENT_DI
            WHERE ENT_NUM IN (${distributionIDS})
            ORDER BY ENT_NUM DESC
            const [data] = await sequelize.query(queryString) as [P_ENT[], unknown]
        `

        const [entries] = await sequelize.query(queryString2) as [P_ENT_DI[], unknown]

        const distribution = {
            "initial": (
                entries.filter((distEntry) => {
                    return isDistInitialEntry(distEntry)
                })
            )
            ,
            "dispatch": (
                entries.filter((distEntry) => {
                    return !isDistInitialEntry(distEntry)
                })
            )
            ,
            "aboutToLeave": (
                entries.filter((distEntry) => {
                    return !isDistInitialEntry(distEntry)
                })
            ),
            "all": entries,
        }

        const distEntries = distribution[entriesType]

        response.status(200).json(distEntries);

    } catch (error) {
        console.log(error)
        response.status(500).json({
            error,
            message: "There has been an error in the server"
        });
    }
}

export default distributionEntriesHandler;