import authorizationConfig from "@/utils/services/authorizationConfig";
import axios from "axios"
import base_url from ".";

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
    const { data } = await axios.post<AuthCredentials>(`${base_url}/api/auth/login`, body)
    return data;
  }

  getAuthQRCode = async (email: string, token: string) => {
    const config = authorizationConfig(token)
    const { data } = await axios.post<AuthQRCodeResponse>(`${base_url}/api/auth/qrcode`, { email }, config)
    return data;
  }

  verifyAuthOTP = async (body: VerifyAuthOTP) => {
    debugger
    const { data } = await axios.post<{ verified: boolean }>(`${base_url}/api/auth/verifyAuthOTP`, body)
    return data.verified;
  }
}

export default AuthService;