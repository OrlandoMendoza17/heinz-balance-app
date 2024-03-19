import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  chargePlan: number,
}

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const { chargePlan }: BodyProps = request.body

    // Trae el plan de carga y su peso asignado
    const queryString1 = `
      SELECT * FROM OPENQUERY(JDE, '
        SELECT LLLDNM, LLSCWT FROM PRODDTA.F4961
        WHERE LLLDNM IN (''${chargePlan}'')
        ORDER BY LLLDNM DESC
      ')
    `

    // Trae el plan de carga y su destino asignado
    const queryString2 = `
      SELECT * FROM OPENQUERY(JDE, '
        SELECT TMLDNM, TMCTY1 FROM PRODDTA.F4960
        WHERE TMLDNM IN (''${chargePlan}'')
        ORDER BY TMLDNM DESC
      ')
    `

    // const sequelize = await getSequelize()

    const [data1] = await sequelize.query(queryString1) as [F4961[], unknown]
    const [data2] = await sequelize.query(queryString2) as [F4960[], unknown]

    const chargePlanInfo: ChargePlanInfo = {
      number: data1[0].LLLDNM,
      weight: parseFloat((data1[0].LLSCWT / 10000).toFixed(2)),
      destination: data2[0].TMCTY1,
    }

    response.status(200).json(chargePlanInfo);

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default testHandler;