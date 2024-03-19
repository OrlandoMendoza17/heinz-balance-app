// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSQLValue } from "./newEntry";

type BodyProps = {
  distEntry: P_ENT_DI;
};

const updateDistEntryHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    const { distEntry }: BodyProps = request.body

    const object = Object.entries(distEntry)
    const values = object.map(([key, value]) => `${key} = ${getSQLValue(value)}`).join(",\n    ")
    
    const queryString = `
      UPDATE H025_P_ENT_DI
      SET 
        ${values}
      WHERE ENT_NUM = ${distEntry.ENT_NUM};
    `

    // const sequelize = await getSequelize()
    // await sequelize.query(queryString)

    response.status(200).json({
      message: `Dist Entry ${distEntry.ENT_NUM} Updated Succesfully`
    });

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default updateDistEntryHandler;


`
UPDATE H025_P_ENT_DI
SET 
  ENT_NUM = '92596',
  USU_LOG = 'ocastillo',
  ENT_DI_FEC = '2023-11-16T11:13:52.933Z',
  ENT_DI_PRO = 'VALENCIA',
  ENT_DI_GUI = '125240',
  ENT_DI_PNC = 5051.01,
  ENT_DI_CPA = 0,
  ENT_DI_PPA = 30,
  ENT_DI_PLA = '125240',
  ENT_DI_DES = 'BARQUISIMETO',
  ENT_DI_PAD = 0,
  ENT_DI_DPA = null,
  ENT_DI_STA = 1,
  ENT_DI_AUT = null,
  ENT_DI_NDE = '125240',
  ENT_DI_PAL = null,
  ENT_DI_OBS = null,
  ENT_DI_REV = false
WHERE ENT_NUM = 92596;
`