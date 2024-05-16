// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

export type SearchUserBy = Partial<Pick<User, "email" | "ficha" | "cedula" | "accountName">>

const usersHandler = async (request: NextApiRequest, response: NextApiResponse,) => {

  const { email, ficha, cedula, accountName }: SearchUserBy = request.body

  try {

    const options = [
      email ? `USU_MAI = '${email}'` : "",
      ficha ? `USU_FIC = ${ficha}` : "",
      cedula ? `USU_CED = '${cedula}'` : "",
      accountName ? `USU_LOG = '${accountName}'` : "",
    ]
    
    const queryString = `
      SELECT * FROM [HDTA025].[dbo].[H025_S_USU]
      ${options.reduce((accumulator, field, index) => {
      if (field) {
        return `${accumulator} ${!accumulator.includes("WHERE") ? `WHERE ${field}` : ` OR ${field}`}`
      } else {
        return accumulator
      }
    }, "")
      }
    `

    // const sequelize = await getSequelize()
    const [data] = await sequelize.query(queryString) as [S_USU[], unknown]

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

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default usersHandler;