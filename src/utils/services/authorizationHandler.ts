import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const authorizationHandler = (request: NextApiRequest, response: NextApiResponse, callback: (payload: jwt.JwtPayload) => void) => {
  
  const token = (request.headers.authorization || "").split("Bearer ").at(1)
  const jwt_secret = process.env.jwt_SECRET || ""
  
  console.log("token", token)
  
  if (token) {
    
    try {
      
      const payload = jwt.verify(token, jwt_secret) as jwt.JwtPayload
      callback(payload)
  
    } catch (error) {
      response.status(401).json({
        status: 401,
        message: "Unauthorized"
      })
    }

  } else {
    response.status(400).json({
      status: 400,
      message: "Bad Request"
    })
  }
  
}

export default authorizationHandler