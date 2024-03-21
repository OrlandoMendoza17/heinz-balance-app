// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";
import { DelimiterParser, SerialPort } from "serialport";

const testHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {
    
    const puerto = new SerialPort({
      path: "COM4",
      baudRate: 9600,
    })

    const parser = puerto.pipe(new DelimiterParser({ delimiter: "\n" }))

    parser.on("data", function (data) {
      console.log('data', data)
      response.status(200).json(data);
    })
    
  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }
  
}

export default testHandler;
