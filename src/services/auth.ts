import authorizationConfig from "@/utils/services/authorizationConfig";
import axios from "axios"

type AuthQRCodeResponse = {
  qrcode: string,
  code: string,
}

export type VerifyAuthOTP = {
  secret: string;
  OTPCode: string;
}

export type LoginRequest = {
  nombre: string,
  email: string,
  ficha: string,
}

export type Set2FactorAuth = {
  email: string,
}

class AuthService {
  login = async (body: User) => {
    const { data } = await axios.post<AuthCredentials>("/api/auth/login", body)
    return data;
  }

  getAuthQRCode = async (email: string, token: string) => {
    const config = authorizationConfig(token)
    const { data } = await axios.post<AuthQRCodeResponse>("/api/auth/qrcode", { email }, config)
    return data;
  }

  verifyAuthOTP = async (body: VerifyAuthOTP) => {
    debugger
    const { data } = await axios.post<{ verified: boolean }>("/api/auth/verifyAuthOTP", body)
    return data.verified;
  }

  getUsers = async (email: string = "") => {
    const { data } = await axios.post<User[]>("/api/auth/users", { email })
    return email ? data[0] : data
  }
  
  getRol = async (userRolID: S_USU["ROL_COD"]) => {
    const { data } = await axios.post<S_ROL>("/api/auth/rols", { userRolID })
    return data.ROL_DES
  }
}

export default AuthService;