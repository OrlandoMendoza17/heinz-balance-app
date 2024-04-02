import { NewEntry } from "@/components/pages/VehiculesEntrance";
import { NewExit } from "@/components/pages/VehiculesExit";
import { DESTINATION_TABLES, ORIGIN_BY_DESTINATION } from "@/lib/enums";
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";

export type NewExitParamsBodyProps = {
  leavingEntry: NewExit,
  updateEntryByDestination: object | undefined,
  destination: DES_COD,
}

export const getSQLValue = (value: string | number | null) => {
  return (
    (typeof value === "string") ?
      `'${value}'` :
      (value === null) ? JSON.stringify(value) : value
  )
}

const newExitHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {

    const { leavingEntry, updateEntryByDestination, destination }: NewExitParamsBodyProps = request.body

    console.log('leavingEntry', leavingEntry)

    const getExitQueryString = () => {
      const keys = `(${Object.keys(leavingEntry).map(key => `[${key}]`).join(", ")})`
      const values = `(${Object.values(leavingEntry).map(value => getSQLValue(value)).join(", ")})`

      const queryString = `
        INSERT H025_P_SAL\n${keys} 
        VALUES ${values}
      `

      return queryString;
    }

    const getUpdateQueryString = () => {

      if (updateEntryByDestination) {

        const object = Object.entries(updateEntryByDestination)
        const values = object.map(([key, value]) => `${key} = ${getSQLValue(value)}`).join(",\n    ")

        const queryString = `
          UPDATE H025_P_${DESTINATION_TABLES[destination]}
          SET
            ${values}
          WHERE ENT_NUM = ${leavingEntry.ENT_NUM};
        `
        return queryString;

      } else {
        return "";
      }

    }

    const queryString1 = getExitQueryString()
    const queryString2 = getUpdateQueryString()

    console.log('queryString1', queryString1)
    console.log('queryString2', queryString2)

    // const sequelize = await getSequelize()
    
    await sequelize.query(queryString1)
    if (queryString2) await sequelize.query(queryString2)

    response.status(201).json({
      message: "Created Succesfully",
      queries: {
        queryString1,
        queryString2,
      }
    })

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default newExitHandler;