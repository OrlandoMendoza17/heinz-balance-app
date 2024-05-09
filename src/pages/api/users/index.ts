// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  email: S_USU["USU_MAI"],
}

const usersHandler = async (request: NextApiRequest, response: NextApiResponse,) => {

  const { email }: BodyProps = request.body

  try {

    const queryString = `
      SELECT * FROM [HDTA025].[dbo].[H025_S_USU]
      ${email ? `WHERE USU_MAI = '${email}'` : ""
      }
    `

    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [S_USU[], unknown]

    if (data.length) {

      const users: User[] = data.map((user) => {
        return {
          nombre: user.USU_NOM,
          email: user.USU_MAI,
          ficha: user.USU_FIC,
          cedula: user.USU_CED,
          rol: user.ROL_COD,
          accountName: user.USU_LOG,
          status: Boolean(user.USU_STA),
        }
      })

      response.status(200).json(users);
      
    } else {
      response.status(400).json({
        message: `No se encontró registrado el usuario "${email}" con un rol asignado.`
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

export default usersHandler;