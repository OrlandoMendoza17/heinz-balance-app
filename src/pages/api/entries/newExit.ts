import { NewEntry } from "@/components/pages/VehiculesEntrance";
import { DESTINATION_TABLES, ORIGIN_BY_DESTINATION } from "@/lib/enums";
import getSequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  entry: NewEntry,
  entryByDestination: object,
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

    const { entry, entryByDestination }: BodyProps = request.body

    const getExitString = () => {
      const keys = `(${Object.keys(entry).map(key => `[${key}]`).join(", ")})`
      const values = `(${Object.values(entry).map(value => getSQLValue(value)).join(", ")})`

      const queryString = `
        INSERT H025_P_SAL\n${keys} 
        VALUES ${values}
      `
      
      return queryString;
    }

    const getUpdateQueryString = () => {
      const keys = `(${Object.keys(entryByDestination).map(key => `[${key}]`).join(", ")})`
      const values = `(${Object.values(entryByDestination).map(value => getSQLValue(value)).join(", ")})`

      const queryString = `
        INSERT H025_P_${DESTINATION_TABLES[entry.DES_COD]}\n${keys} 
        VALUES ${values}
      `

      return queryString;
    }

    const queryString1 = getExitString()
    const queryString2 = getUpdateQueryString()

    console.log('queryString1', queryString1)
    console.log('queryString2', queryString2)

    const sequelize = await getSequelize()
    // await sequelize.query(queryString1)
    // await sequelize.query(queryString2)

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