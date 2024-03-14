// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getSequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { format } from 'date-fns';

type Data = {
    name: string;
};

const readEntryHandler = async (request: NextApiRequest, response: NextApiResponse) => {
    try {

        const today = format(new Date(), "yyyy-LL-dd")

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
        const sequelize = await getSequelize()
        const [data] = await sequelize.query(queryString) as [P_ENT[], unknown]

        response.status(200).json(data);

    } catch (error) {
        console.log(error)
        response.status(500).json({
            error,
            message: "There has been an error in the server"
        });
    }

}

export default readEntryHandler;