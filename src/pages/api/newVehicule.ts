// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSQLValue } from "./entries/newEntry";

type BodyProps = {
  vehicule: T_VEH,
}

const newVehiculeHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    const METHOD = request.method

    if (METHOD === "POST") {

      const { vehicule }: BodyProps = request.body

      const keys = `(${Object.keys(vehicule).map(key => `[${key}]`).join(", ")})`
      const values = `(${Object.values(vehicule).map(value => getSQLValue(value)).join(", ")})`

      const queryString = `
        INSERT H025_T_VEH\n${keys} 
        VALUES ${values}
      `
      
      console.log('queryString', queryString)
      
      // const sequelize = await getSequelize()
      // await sequelize.query(queryString)

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