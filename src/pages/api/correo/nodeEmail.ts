// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import getSequelize from "@/lib/mssql";
import type { NextApiRequest, NextApiResponse } from "next";

import nodemailer from "nodemailer";

const emailHandler = async (request: NextApiRequest, response: NextApiResponse,) => {
  try {

    // const email = "c-itvzla_apps@kraftheinz.com"
    // const password = "PGAEWf7QuV"
    
    const email = "ommv.17@hotmail.com"
    const password = "OMMV_SVMV_1762"

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: email,
        pass: password,
      }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"DEPARTAMENTO IT VENEZUELA 👻" <${email}>`, // sender address
      to: "ommv.17@gmail.com", // list of receivers
      subject: "Mensaje Importante ❗", // Subject line
      html: `
        <section>
          <p>Hola Soy Newton 🐕</p>
          <img src="https://i.imgur.com/vebmOnB.jpg"/>
        </section>
      `, // html body
    });

    console.log('info', info)

    response.status(200).json(info);

  } catch (error) {
    console.log(error)
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    });
  }

}

export default emailHandler;