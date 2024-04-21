// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    
    const queryString = `
    SELECT * FROM [HDTA025].[dbo].[H025_S_USU]
    WHERE USU_CLA is null
    and USU_MAI in (
        'otto.castillo@kraftheinz.com',
        'victor.castillo@kraftheinz.com',
        'alexander.rojas@kraftheinz.com',
        'daniel.paredes@kraftheinz.com',
        'diomer.perez@kraftheinz.com',
        'eleana.escobar@kraftheinz.com',
        'emerson.guzman@kraftheinz.com',
        'gregorio.naranjo@kraftheinz.com',
        'henry.sumosa@kraftheinz.com',
        'howie.rodriguez1@kraftheinz.com',
        'humberto.benitez@kraftheinz.com',
        'isandra.abreu11@kraftheinz.com',
        'jesus.olmedo@kraftheinz.com',
        'joan.parra@kraftheinz.com',
        'johnsson.gonzalez@kraftheinz.com',
        'kellmis.gerrero11@kraftheinz.com',
        'luis.herrera@kraftheinz.com',
        'luis.inojosa@kraftheinz.com',
        'luis.vazquez@kraftheinz.com',
        'manuel.sotillo@kraftheinz.com',
        'marelys.rios@kraftheinz.com',
        'marianella.rincon@kraftheinz.com',
        'mgastelo@kraftheinz.com',
        'nelson.barreat@kraftheinz.com',
        'pacheco.adriana@kraftheinz.com',
        'randy.navas@kraftheinz.com',
        'robert.perez@kraftheinz.com',
        'romer.colina@kraftheinz.com',
        'roselin.villegas@kraftheinz.com',
        'santiago.tovar@kraftheinz.com',
        'waleska.gonzalez@kraftheinz.com',
        'yamileth.mujica@kraftheinz.com',
        'yaritza.herrera@kraftheinz.com'
    )
    order by USU_MAI
    `
    
    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [unknown[], unknown]
    
    response.status(200).json(data);
    
  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
  
}

export default testHandler;