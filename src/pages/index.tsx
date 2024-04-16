import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCookie, setCookie } from "@/utils/cookies";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { TbLogin2 } from "react-icons/tb";
import Form from "@/components/widgets/Form";
import Input from "@/components/widgets/Input";
import Button from "@/components/widgets/Button";
import Spinner from "@/components/widgets/Spinner";
import AuthService from "@/services/auth";
import useNotification from "@/hooks/useNotification";
import NotificationModal from "@/components/widgets/NotificationModal";
import getDestinationEntryQuery from "@/utils/api/aboutToLeave";
import { AxiosError } from "axios";

const auth = new AuthService()

const Home = () => {

  const { instance } = useMsal()
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const [status, handleStatus] = useNotification()

  useEffect(() => {
    const credentials = getCookie<AuthCredentials>("login")
    if (!credentials) {

      sessionStorage.clear()
      localStorage.clear()
      document.cookie = ""

    }
  }, [])

  useEffect(() => {
    const query = getDestinationEntryQuery("D05", "1")
    console.log('query', query)
  }, [])

  const handleLoginMicrosoft: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      
      // Busca el rol en la base de datos local
      const foundUser = await auth.getUsers(email) as User
      
      const data = await instance.loginPopup({
        scopes: ["user.read"],
        prompt: "create",
        loginHint: email,
      })

      console.log(data)

      const user: User = {
        ...foundUser,
        nombre: data.account.name || "",
      }

      const credentials = await auth.login(user)
      setCookie("login", credentials, 10)

      handleStatus.open(({
        type: "success",
        title: "Inicio de Sesión",
        message: `Has iniciado sesión exitosamente"`,
      }))

      if (user.rol === "01" || user.rol === "02" || user.rol === "03") {

        router.push("/romana")

      } else if (user.rol === "04") {

        router.push("/transporte")

      } else if (user.rol === "05" || user.rol === "06") {

        router.push("/distribucion/entradas")

      }

      setLoading(false)

    } catch (error: unknown) {
      setLoading(false)
      console.log(error)
        
      if (error instanceof AxiosError && error.response?.status) {

        handleStatus.open(({
          type: "danger",
          title: "Inicio de Sesión inválido❗",
          message: error.response.data.message,
        }))
        
      } else {

        handleStatus.open(({
          type: "danger",
          title: "Error",
          message: "Ha habido un error con el inicio de sesión",
        }))
      }
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ currentTarget }) => {
    const { value } = currentTarget
    setEmail(value.trim())
  }

  return (
    <main className={`LoginForm`}>

      <img className="justify-self-center" width={150} src="https://i.imgur.com/yoGBPON.png" alt="" />

      <UnauthenticatedTemplate>
        <Form onSubmit={handleLoginMicrosoft}>
          <h1>Ingresar al sistema de balanza:</h1>

          <Input
            id="email"
            value={email}
            className="w-full"
            placeholder="Correo Electrónico"
            onChange={handleChange}
          />

          <Button type="submit" title="boton rojo" color="secondary" loading={loading}>
            Iniciar Sesión <TbLogin2 size={20} />
          </Button>

        </Form>
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        {/* <h4 className="text-center">Iniciando Sesión...</h4> */}
        <div className="p-10">
          <Spinner size="small" />
        </div>
        {/* <button onClick={() => instance.logout()}>Sign out</button> */}
      </AuthenticatedTemplate>

      <NotificationModal alertProps={[status, handleStatus]} />
    </main>
  );
}

export default Home