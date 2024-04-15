import axios from "axios";
import { NewExitParamsBodyProps } from "@/pages/api/exits/newExit";
import { GetExitsBodyProps } from "@/pages/api/exits";

type NewExitParams = NewExitParamsBodyProps

export const createNewExit = async (body: NewExitParams) => {
  const { data } = await axios.post("/api/exits/newExit", body)
  return data;
}

export const getExits = async (body: GetExitsBodyProps) => {
  const { data } = await axios.post<Exit[]>("/api/exits", body)
  return data;
}

`
SELECT *
FROM H025_P_ENT AS ent
INNER JOIN H025_P_SAL AS sal ON ent.ENT_NUM = sal.ENT_NUM
WHERE   AND ent.ENT_NUM = '94641'  AND VEH_ID = '1694'
ORDER BY SAL_FEC DESC;
`