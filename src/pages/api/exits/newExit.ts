import { NewExit } from "@/components/pages/VehiculesExit";
import { DESTINATION_TABLES, ORIGIN_BY_DESTINATION } from "@/lib/enums";
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { getInsertAttributes } from "@/utils/api/insert";
import { getUPDATEValues } from "@/utils/api/update";
import { NextApiRequest, NextApiResponse } from "next";

export type NewExitParamsBodyProps = {
  leavingEntry: NewExit,
  updateEntryByDestination: object | undefined,
  destination: DES_COD,
}

const newExitHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  const transaction = await sequelize.transaction()
  try {

    const { leavingEntry, updateEntryByDestination, destination }: NewExitParamsBodyProps = request.body

    console.log('leavingEntry', leavingEntry)

    const [keys, values] = getInsertAttributes(leavingEntry)
    
    const queryString1 = `
      INSERT H025_P_SAL\n${keys} 
      VALUES ${values}
    `

    await sequelize.query(queryString1)
    
    if (updateEntryByDestination) {

      const values = getUPDATEValues(updateEntryByDestination)

      const queryString2 = `
        UPDATE H025_P_${DESTINATION_TABLES[destination]}
        SET
          ${values}
        WHERE ENT_NUM = ${leavingEntry.ENT_NUM};
      `
      
      await sequelize.query(queryString2)
    }

    await transaction.commit()

    response.status(201).json({
      message: "Created Succesfully",
    })

  } catch (error) {
    await transaction.rollback();
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default newExitHandler;