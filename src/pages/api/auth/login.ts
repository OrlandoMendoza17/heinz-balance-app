import { LoginRequest } from "@/services/auth";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"

const LoginHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { nombre, email, ficha }: LoginRequest = request.body

  try {

    const generateJWT = () => {
      const secret = process.env.JWT_SECRET || ""
      const payload = {
        sub: email,
      }

      console.log('secret', secret)
      console.log('payload', payload)

      const token = jwt.sign(payload, secret)
      response.json({ user: { nombre, email, ficha }, token })
    }

    generateJWT()

  } catch (error) {
    response.status(500).json({
      status: 500,
      message: "There's occured an error!"
    })
  }

}

export default LoginHandler;