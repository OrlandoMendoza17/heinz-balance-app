import { getCookie } from "@/utils/cookies"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const initializedUser = {
  id: 0,
  nombre: "",
  email: "@kraftheinz.com",
  ficha: "",
  // password_login_available: false,
  // password: "",
  // is_admin: false,
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
      debugger
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