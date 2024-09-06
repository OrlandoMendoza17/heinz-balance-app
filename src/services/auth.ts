import authorizationConfig from "@/utils/services/authorizationConfig";
import axios from "axios"
import base_url from ".";

/**
 * No esta en uso actualmente
 * @param {string} qrcode 
 * @param {string} code
 */
type AuthQRCodeResponse = {
  qrcode: string,
  code: string,
}

/**
 * Información necesaria para verificar la autenticación mediante OTP.
 * @param {string} secret - Secreto compartido para generar el código OTP.
 * @param {string} OTPCode - Código OTP generado para la autenticación.
 */
export type VerifyAuthOTP = {
  secret: string;
  OTPCode: string;
}

/**
 * Información necesaria para realizar una solicitud de inicio de sesión.
 * @param {string} nombre - Nombre de usuario para la autenticación.
 * @param {string} email - Dirección de correo electrónico asociada al usuario.
 * @param {string} ficha - Número de ficha o identificador único del usuario.
 */
export type LoginRequest = {
  nombre: string,
  email: string,
  ficha: string,
}

/**
 * Información necesaria para configurar la autenticación de dos factores.
 * @param {string} email - Dirección de correo electrónico asociada al usuario que se va a configurar la autenticación de dos factores.
 */
export type Set2FactorAuth = {
  email: string,
}

/**
 * Clase que proporciona métodos para autenticar a los usuarios.
 */
class AuthService {

  /**
  * Método que realiza la autenticación de un usuario mediante credenciales.
  * 
  * @param {User} body - Información del usuario que se va a autenticar.
  * @returns {Promise<AuthCredentials>} Promesa que se resuelve con las credenciales de autenticación si el usuario es válido.
  */
  login = async (body: User) => {

    // Se utiliza la biblioteca Axios para realizar una solicitud HTTP POST a la API de autenticación.
    // La solicitud se envía a la ruta `/api/auth/login` con la información del usuario en el cuerpo de la solicitud.

    const { data } = await axios.post<AuthCredentials>(`${base_url}/api/auth/login`, body)
    //  Se devuelve la respuesta de la API que contiene las credenciales de autenticación.
    return data;
  }
  /**
   * Método que obtiene un código QR de autenticación para un usuario específico.
   * 
   * @param {string} email - Dirección de correo electrónico del usuario que se va a autenticar.
   * @param {string} token - Token de autenticación que se utiliza para autorizar la solicitud.
   * @returns {Promise<AuthQRCodeResponse>} Promesa que se resuelve con la respuesta de la API que contiene el código QR de autenticación.
   */
  getAuthQRCode = async (email: string, token: string) => {
    //Se crea una configuración de autorización utilizando el token proporcionado
    const config = authorizationConfig(token)


    //Se utiliza la biblioteca Axios para realizar una solicitud HTTP POST a la API de autenticación.
    //La solicitud se envía a la ruta `/api/auth/qrcode` con la dirección de correo electrónico del usuario en el cuerpo de la solicitud.
    //La configuración de autorización se pasa como tercer parámetro para autorizar la solicitud.

    const { data } = await axios.post<AuthQRCodeResponse>(`${base_url}/api/auth/qrcode`, { email }, config)
    //Se devuelve la respuesta de la API que contiene el código QR de autenticación.
    return data;
  }

  /**
 * Método que verifica la autenticación de un usuario mediante un código OTP.
 * @param {VerifyAuthOTP} body - Información necesaria para verificar la autenticación, incluyendo el secreto y el código OTP.
 * @returns {Promise<boolean>} Promesa que se resuelve con un valor booleano que indica si la autenticación es válida o no.
 */
  verifyAuthOTP = async (body: VerifyAuthOTP) => {
    //Punto de interrupción para depurar el código.
    debugger

    //Se utiliza la biblioteca Axios para realizar una solicitud HTTP POST a la API de autenticación.
    //La solicitud se envía a la ruta `/api/auth/verifyAuthOTP` con la información de verificación en el cuerpo de la solicitud.

    const { data } = await axios.post<{ verified: boolean }>(`${base_url}/api/auth/verifyAuthOTP`, body)
    //Se devuelve el valor booleano que indica si la autenticación es válida o no.
    return data.verified;
  }
}

export default AuthService;