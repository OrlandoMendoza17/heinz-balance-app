import { LoginRequest } from "@/services/auth";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"

const LoginHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  const user: LoginRequest = request.body

  try {

    const generateJWT = () => {
      const secret = process.env.JWT_SECRET || ""
      const payload = {
        sub: user.email,
      }

      console.log('secret', secret)
      console.log('payload', payload)

      const token = jwt.sign(payload, secret)
      response.json({ user, token })
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