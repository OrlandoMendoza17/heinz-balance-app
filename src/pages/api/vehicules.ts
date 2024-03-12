import getSequelize from "@/lib/mssql";
import { VEHICULE_COMPANY_NOT_FOUND, VEHICULE_NOT_FOUND } from "@/utils/services/errorMessages";
import { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  vehiculePlate: string,
}

const driversHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    
    const METHOD = request.method
    const { vehiculePlate }: BodyProps = request.body
    
    console.log('vehiculePlate', vehiculePlate)
    
    if (METHOD === "POST") {

      const queryString1 = `
        SELECT * FROM [HDTA025].[dbo].[H025_T_VEH] 
        WHERE VEH_PLA = '${vehiculePlate}'
      `
      
      const sequelize = await getSequelize()
      
      const [data1] = await sequelize.query(queryString1) as [T_VEH[], unknown]
      
      if(data1.length){
        
        const queryString2 = `
          SELECT * FROM [HDTA025].[dbo].[H025_T_TRA]
          WHERE TRA_COD = '${data1[0].TRA_COD}'
        `
        
        const [data2] = await sequelize.query(queryString2) as [T_TRA[], unknown]
        
        if(data2.length){
          
          const vehicule: Vehicule = {
            id: data1[0].VEH_ID,
            plate: data1[0].VEH_PLA,
            model: data1[0].VEH_MOD,
            type: data1[0].VEH_TIP,
            capacity: data1[0].VEH_CAP,
            company: data2[0].TRA_NOM,
          }
          
          response.json(vehicule)
        }else{
          response.status(400).json({
            message: VEHICULE_COMPANY_NOT_FOUND
          });
        }
        
      }else{
        response.status(400).json({
          message: VEHICULE_NOT_FOUND
        });
      }
      
      
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

export default driversHandler;