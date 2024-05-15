import React, { MouseEventHandler, SetStateAction } from 'react'
import { GoDotFill } from "react-icons/go";
import { ACTION_BY_NAME, DESTINATION_BY_CODE } from '@/lib/enums'
import { getCuteFullDate } from '@/utils/parseDate'

type Props = {
  rols: S_ROL[],
  setModal: (value: SetStateAction<boolean>) => void,
  setSelectedUser: (value: SetStateAction<User>) => void,
  user: User
}

const TableUsers = ({ setModal, setSelectedUser, rols, user }: Props) => {

  const handleClick: MouseEventHandler<HTMLTableRowElement> = () => {
    // alert("Hello! I'm the radio demon! 👹")
    setModal(true)
    setSelectedUser(user)
  }

  const { nombre, email, ficha, cedula, rol, accountName, status } = user

  return (
    <tr onClick={handleClick}>
      <td>{nombre}</td>
      <td>{email}</td>
      <td>{ficha}</td>
      <td>{cedula}</td>
      <td>{rols.find(({ ROL_COD }) => ROL_COD === rol)?.ROL_DES}</td>
      <td>{accountName}</td>
      <td className="flex gap-2 items-center">
        {
          status ?
            <GoDotFill size={20} className="fill-emerald-500" />
            :
            <GoDotFill size={20} className="fill-slate-500" />
        }
        <span>
          {
            status ? "Activo" : "Inactivo"
          }
        </span>
      </td>
    </tr>
  )
}

export default TableUsers