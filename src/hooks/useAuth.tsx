import { getCookie } from "@/utils/cookies"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const initializedUser: User = {
  nombre: "",
  email: "",
  ficha: 0,
  cedula: "",
  rol: "",
  accountName: "",
  status: Boolean(0),
}

const useAuth = (): [boolean, AuthCredentials] => {

  const router = useRouter()

  const [renderPage, setRenderPage] = useState<boolean>(false)
  const [credentials, setCredentials] = useState<AuthCredentials>({
    user: initializedUser,
    token: "",
  })

  useEffect(() => {
    const credentials = getCookie<AuthCredentials>("login")
    if (credentials) {
      
      const { user } = credentials

      setCredentials(credentials)
      setRenderPage(true)

    } else {
      router.push("/")
    }
  }, [])

  return [renderPage, credentials];
}

export default useAuth;