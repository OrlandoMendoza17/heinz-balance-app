import { LoginRequest } from "@/services/auth";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"

/**
 * Maneja una solicitud de inicio de sesión.
 * 
 * Esta función es un punto de entrada de API que autentica a un usuario y devuelve un token de acceso.
 * 
 * @param {NextApiRequest} request - El objeto de solicitud entrante.
 * @param {NextApiResponse} response - El objeto de respuesta para enviar de vuelta al cliente.
 */
const LoginHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  //Extrae la información del usuario de la solicitud.
  const user: LoginRequest = request.body

  try {
    //Genera un token de acceso para el usuario autenticado.
    const generateJWT = () => {
      //Obtiene la clave secreta para firmar el token.
      const secret = process.env.JWT_SECRET || ""
      // Crea el payload del token con la información del usuario.
      const payload = {
        sub: user.email,
      }

      console.log('secret', secret)
      console.log('payload', payload)
      // Firma el token con la clave secreta y devuelve la respuesta
      const token = jwt.sign(payload, secret)
      response.json({ user, token })
    }
    //Ejecuta la función para generar el token de acceso.
    generateJWT()

  } catch (error) {
    //Maneja cualquier error que ocurra durante el proceso de autenticación.
    response.status(500).json({
      status: 500,
      message: "There's occured an error!"
    })
  }

}

export default LoginHandler;