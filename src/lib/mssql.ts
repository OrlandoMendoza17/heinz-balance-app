import tedious from "tedious"
import { Sequelize } from "sequelize"
import getSecrets from "@/services/azure-key-vault"

const ENVIRONMENT = process.env.NODE_ENV as string

const dbHost = process.env.DB_HOST as string
const dbUser = process.env.DB_USER as string
const dbName = process.env.DB_NAME as string
const dbPassword = process.env.DB_PASSWORD as string
const dbInstance = process.env.DB_INSTANCE as string
const dbPort = process.env.DB_PORT as string

const MINUTE = 60 * 1000;

// const getSequelize = async () => {

//   type DB_CREDENTIALS = {
//     DB_HOST: string,
//     DB_INSTANCE: string,
//     DB_NAME: string,
//     DB_USER: string,
//     DB_PASSWORD: string,
//   }

//   const credentials = await getSecrets()

//   console.log("credential", credentials)

//   const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_INSTANCE }: DB_CREDENTIALS = JSON.parse(credentials as string)

//   console.log("dbUser: ", DB_HOST)
//   console.log("dbHost: ", DB_NAME)
//   console.log("dbName: ", DB_USER)
//   console.log("dbPassword: ", DB_PASSWORD)
//   console.log("dbInstance: ", DB_INSTANCE)

//   const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
//     host: dbHost,
//   // const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
//   //   host: DB_HOST,
//     port: 1433,
//     dialect: "mssql",
//     dialectModule: tedious,
//     dialectOptions: {
//       options: {
//         instanceName: dbInstance,
//         // instanceName: DB_INSTANCE,
//         trustServerCertificate: true, // change to true for local dev / self-signed certs,
//         encrypt: false,
//         connectTimeout: 2 * MINUTE,
//         requestTimeout: 5 * MINUTE,
//       }
//     }
//   })

//   return sequelize;
// }

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: 1433,
  dialect: "mssql",
  dialectModule: tedious,
  dialectOptions: {
    options: {
      instanceName: dbInstance,
      trustServerCertificate: true, // change to true for local dev / self-signed certs,
      encrypt: false,
      connectTimeout: .5 * MINUTE,
      requestTimeout: 5 * MINUTE,
    }
  }
})

export default sequelize;