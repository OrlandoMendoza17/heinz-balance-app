// import getSequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/mssql";
import { getUPDATEValues } from "@/utils/api/update";

type BodyProps = {
  distEntry: P_ENT_DI;
};

const updateDistEntryHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    const { distEntry }: BodyProps = request.body

    const values = getUPDATEValues(distEntry)
    
    const queryString = `
      UPDATE H025_P_ENT_DI
      SET 
        ${values}
      WHERE ENT_NUM = ${distEntry.ENT_NUM};
    `

    // const sequelize = await getSequelize()
    await sequelize.query(queryString)

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