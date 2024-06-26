// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { getExits } from "@/services/exits";
import sequelize from "@/lib/mssql";
import { getEntryDifferences } from "@/services/entries";


type BodyProps = {
  dateFrom: string;
  dateTo: string;
  entryNumbers: string[];
}

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    const body: BodyProps = request.body

    const exitDifs = await getEntryDifferences(body)

    const entryNumbers = exitDifs.map(({ entryNumber }) => entryNumber)

    console.log('entryNumbers', entryNumbers)

    const searchParams = {
      dateFrom: '',
      dateTo: '',
      cedula: '',
      plate: '',
      entryNumbers
    }

    let exits = await getExits(searchParams)

    const data = exits.map((exit) => { 
      const entryDifference = exitDifs.find((difference) => exit.entryNumber === difference.entryNumber)
      return {
        ...exit,
        entryDifference,
      }
    })

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