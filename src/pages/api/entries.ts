import getSequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";

const entriesHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    
    const queryString = ``
    
    const sequelize = await getSequelize()
    await sequelize.query(queryString)
    
    response.status(201).json({
      message: "Created Succesfully"
    })
    
    
  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
}

export default entriesHandler;