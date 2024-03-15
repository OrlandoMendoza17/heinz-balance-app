// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getSequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { format } from 'date-fns';

type BodyProps = {
    entriesType: "initial" | "dispatch" | "aboutToLeave" | "all";
};

const json: P_ENT_DI[] = [
    {
        "ENT_NUM": "95530",
        "USU_LOG": "USR9509C",
        "ENT_DI_FEC": "2024-03-15T08:22:04.330Z",
        "ENT_DI_PRO": "VALENCIA ",
        "ENT_DI_GUI": null,
        "ENT_DI_PNC": null,
        "ENT_DI_CPA": 0,
        "ENT_DI_PPA": null,
        "ENT_DI_PLA": null,
        "ENT_DI_DES": null,
        "ENT_DI_PAD": 0,
        "ENT_DI_DPA": null,
        "ENT_DI_STA": null,
        "ENT_DI_AUT": null,
        "ENT_DI_NDE": null,
        "ENT_DI_PAL": null,
        "ENT_DI_OBS": null,
        "ENT_DI_REV": false
    },
    {
        "ENT_NUM": "95525",
        "USU_LOG": "mgastelo",
        "ENT_DI_FEC": "2024-03-15T08:58:13.710Z",
        "ENT_DI_PRO": "VALENCIA ",
        "ENT_DI_GUI": "126413",
        "ENT_DI_PNC": 5647.27,
        "ENT_DI_CPA": 0,
        "ENT_DI_PPA": 30,
        "ENT_DI_PLA": "126413",
        "ENT_DI_DES": "BARCELONA",
        "ENT_DI_PAD": 0,
        "ENT_DI_DPA": null,
        "ENT_DI_STA": 1,
        "ENT_DI_AUT": null,
        "ENT_DI_NDE": "126413",
        "ENT_DI_PAL": null,
        "ENT_DI_OBS": null,
        "ENT_DI_REV": false
    },
    {
        "ENT_NUM": "95524",
        "USU_LOG": "mgastelo",
        "ENT_DI_FEC": "2024-03-15T08:58:01.840Z",
        "ENT_DI_PRO": "MARACAY",
        "ENT_DI_GUI": "126415",
        "ENT_DI_PNC": 7077.1,
        "ENT_DI_CPA": 0,
        "ENT_DI_PPA": 30,
        "ENT_DI_PLA": "126415",
        "ENT_DI_DES": "ANACO",
        "ENT_DI_PAD": 0,
        "ENT_DI_DPA": null,
        "ENT_DI_STA": 1,
        "ENT_DI_AUT": null,
        "ENT_DI_NDE": "126415",
        "ENT_DI_PAL": null,
        "ENT_DI_OBS": null,
        "ENT_DI_REV": false
    }
]

const isDistInitialEntry = (distEntry: P_ENT_DI) => {
    const { ENT_DI_GUI, ENT_DI_PLA, ENT_DI_NDE } = distEntry
    return !(
        Boolean(ENT_DI_GUI) &&
        Boolean(ENT_DI_PLA) &&
        Boolean(ENT_DI_NDE)
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
            WHERE H025_P_SAL.ENT_NUM IS NULL 
            AND DES_COD ='D01'
            ORDER BY ENT_NUM DESC;
        `
        const [data1] = await sequelize.query(queryString) as [P_ENT[], unknown]

        const distributionIDS = data1.map(({ ENT_NUM }) => ENT_NUM)

        const queryString2 = `
            SELECT * FROM H025_P_ENT_DI
            WHERE ENT_NUM IN (${distributionIDS})
            ORDER BY ENT_NUM DESC
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