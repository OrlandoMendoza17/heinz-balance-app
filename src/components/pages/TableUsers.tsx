import React, { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react'
import { GoDotFill } from "react-icons/go";
import { FaTrashCan } from "react-icons/fa6";
import Button from '../widgets/Button';
import ConfirmModal from '../widgets/ConfirmModal';
import useNotification, { HandleNotification } from '@/hooks/useNotification';
import { deleteUser } from '@/services/user';
import { ModalStatus } from '@/pages/usuarios/UsersModal';

type Props = {
  rols: S_ROL[],
  handleAlert: HandleNotification,
  setUsers: Dispatch<SetStateAction<User[]>>
  setModal: (value: SetStateAction<boolean>) => void,
  setModalStatus: Dispatch<React.SetStateAction<ModalStatus>>,
  setSelectedUser: (value: SetStateAction<User>) => void,
  user: User
}

type HandleDeleteUser = {
  button: MouseEventHandler<HTMLButtonElement>,
  confirm: () => void
}

const TableUsers = ({ setModal, setSelectedUser, setModalStatus, setUsers, handleAlert, rols, user }: Props) => {

  const [loading, setLoading] = useState<boolean>(false)

  const [confirm, handleConfirm] = useNotification()

  const { nombre, email, ficha, cedula, rol, accountName, status } = user

  const handleClick: MouseEventHandler<HTMLTableRowElement> = (event) => {
    const target = event.target as HTMLElement
    if (target.tagName !== "BUTTON") {
      // alert("Hello! I'm the radio demon! 👹")
      setModal(true)
      setModalStatus("UPDATE")
      setSelectedUser(user)
    }
  }

  const handleDelete: HandleDeleteUser = {
    button: () => {
      handleConfirm.open({
        type: "warning",
        title: "Advertencia",
        message: `¿Estás seguro de que quieres eliminar el usuario "${user.email}"?`
      })
    },
    confirm: async () => {
      setLoading(true)
      try {

        await deleteUser(email)

        setUsers((users) => users.filter((item) => item.email !== user.email))

        handleAlert.open(({
          type: "success",
          title: "Eliminación de Usuario",
          message: `Se ha eliminado exitosamente el usuario "${email}"`,
        }))

        setLoading(false)

      } catch (error) {
        setLoading(false)
        console.error(error)
        handleAlert.open(({
          type: "danger",
          title: "Error ❌",
          message: "Ha habido un error eliminando el usuario, intentelo de nuevo",
        }))
      }
    }
  }

  return (
    <>
      <tr onClick={handleClick}>
        <td>{nombre}</td>
        <td>{email}</td>
        <td>{ficha}</td>
        <td>{cedula}</td>
        <td>{rols.find(({ ROL_COD }) => ROL_COD === rol)?.ROL_DES}</td>
        <td>{accountName}</td>
        <td>
          <div className="flex gap-2 items-center">
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
          </div>
        </td>
        <td className="text-center">
          <Button loading={loading} onClick={handleDelete.button} className="bg-red-500">
            <FaTrashCan size={15} className="fill-white" />
          </Button>
        </td>
      </tr>
      <ConfirmModal
        acceptAction={handleDelete.confirm}
        confirmProps={[confirm, handleConfirm]}
      />
    </>
  )
}

export default TableUsers