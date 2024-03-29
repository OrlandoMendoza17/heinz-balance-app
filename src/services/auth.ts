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
  login = async (body: LoginRequest) => {
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
}

export default AuthService;