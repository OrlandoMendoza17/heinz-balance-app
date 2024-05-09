// import getSequelize from "@/lib/mssql";
import { DESTINATION_TABLES, ORIGIN_BY_DESTINATION } from "@/lib/enums";
import sequelize from "@/lib/mssql";
import { getInsertAttributes } from "@/utils/api/insert";
import { NewEntry } from "@/utils/getTableValues";
import { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  entry: NewEntry,
  entryByDestination: object,
}

const newEntryHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  const transaction = await sequelize.transaction()
  try {

    const { entry, entryByDestination }: BodyProps = request.body

    const getQueryString1 = () => {
      
      const [keys, values] = getInsertAttributes(entry)
      
      const queryString = `
        INSERT H025_P_ENT\n${keys} 
        VALUES ${values}
      `

      return queryString;
    }

    const getQueryString2 = () => {

      const [keys, values] = getInsertAttributes(entryByDestination)

      const queryString = `
        INSERT H025_P_${DESTINATION_TABLES[entry.DES_COD]}\n${keys} 
        VALUES ${values}
      `

      return queryString;
    }

    const queryString1 = getQueryString1()
    const queryString2 = getQueryString2()

    console.log('queryString1', queryString1)
    console.log('queryString2', queryString2)

    // const sequelize = await getSequelize()
    
    await sequelize.query(queryString1)
    await sequelize.query(queryString2)

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

export default newEntryHandler;