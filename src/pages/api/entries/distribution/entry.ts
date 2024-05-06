// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  entryNumber: P_ENT["ENT_NUM"]
}

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const { entryNumber }: BodyProps = request.body
    
    if(entryNumber){
      
      const queryString = `
        SELECT * FROM H025_P_ENT_DI
        WHERE ENT_NUM = ${entryNumber}
      `
      // const sequelize = await getSequelize()
      const distEntry = (await sequelize.query(queryString) as [P_ENT_DI[], unknown])[0][0]
  
      response.status(200).json(distEntry);
      
    }else{
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

export default testHandler;