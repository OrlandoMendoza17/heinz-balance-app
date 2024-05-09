// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUPDATEValues } from "@/utils/api/update";

type BodyProps = {
  entryNumber: P_ENT["ENT_NUM"],
  entry: UpdateP_ENT
};

const updateEntryHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    const { entryNumber, entry }: BodyProps = request.body

    const values = getUPDATEValues(entry)

    const queryString = `
      UPDATE H025_P_ENT
      SET 
        ${values}
      WHERE ENT_NUM = ${entryNumber};
    `
    
    // const sequelize = await getSequelize()
    await sequelize.query(queryString)

    response.status(200).json({
      message: `Entry ${entryNumber} Updated Succesfully`
    });

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default updateEntryHandler;