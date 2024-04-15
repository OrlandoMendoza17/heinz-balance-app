import useAuth from '@/hooks/useAuth'
import AuthService from '@/services/auth'
import { eraseCookie } from '@/utils/cookies'
import { useMsal } from '@azure/msal-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { IoDocumentTextSharp } from 'react-icons/io5'

const auth = new AuthService()

const User = () => {

  const { instance } = useMsal()

  const [, credentials] = useAuth()
  const { nombre, rol: userRolID } = credentials.user

  const [rol, setRol] = useState<string>("")

  useEffect(() => {
    (async () => {
      if(userRolID){
        try {
          debugger
          const rol = await auth.getRol(userRolID)
          setRol(rol)
        } catch (error) {
          console.log('error', error)        
        }
      }
    })()
  }, [userRolID])


  const handleLogout = () => {
    debugger
    eraseCookie("login")
    instance.logout()
  }

  return (
    <div className="User">
      <span className="text-xs">{rol}</span>
      <img src="https://cdn.icon-icons.com/icons2/1508/PNG/512/systemusers_104569.png" alt="" />
      <span>
        Bienvenido <span className="font-bold text-sky-500">{nombre?.split(" ")[1]}</span>
      </span>
      <ul>
        <li className="px-5 py-2">

        </li>
        <li>
          <Link href="/romana">
            <IoDocumentTextSharp size={20} />
            Manual de Usuario
          </Link>
        </li>
        <li onClick={handleLogout}>
          <span>
            <FiLogOut size={20} />
            Cerrar Sesión
          </span>
        </li>
      </ul>
    </div>
  )
}

export default User