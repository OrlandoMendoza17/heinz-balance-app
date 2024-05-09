// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInsertAttributes } from "@/utils/api/insert";

type BodyProps = {
  vehicule: Omit<T_VEH, "VEH_ID">,
  ORI_ID: 1 | 0
}

const newVehiculeHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    const METHOD = request.method

    if (METHOD === "POST") {

      const { vehicule, ORI_ID }: BodyProps = request.body
      
      vehicule.ORI_ID = ORI_ID
      
      const [keys, values] = getInsertAttributes(vehicule)
       
      const queryString = `
        INSERT H025_T_VEH\n${keys} 
        VALUES ${values}
      `
      
      console.log('queryString', queryString)
      
      // const sequelize = await getSequelize()
      await sequelize.query(queryString)

      response.status(201).json({
        message: "Created Succesfully",
      });

    } else {
      response.status(400).json({
        message: "Bad Request"
      });
    }

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default newVehiculeHandler;