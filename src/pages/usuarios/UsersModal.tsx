import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, lazy, useEffect, useState } from 'react'
import Modal from '../../components/widgets/Modal'
import Button from '../../components/widgets/Button'
import Input from '../../components/widgets/Input'
import { ACTION, ROLS } from '@/lib/enums'
import useNotification, { OpenProps } from '@/hooks/useNotification'
import NotificationModal from '../../components/widgets/NotificationModal'
import Form from '../../components/widgets/Form'
import ConfirmModal from '../../components/widgets/ConfirmModal'
import defaultUser from '@/utils/defaultValues/User'
import Select, { SelectOptions } from '@/components/widgets/Select'
import { createUser, getUsers, updateUser } from '@/services/user'

export type ModalStatus = "CREATE" | "UPDATE"

type Props = {
  user: User,
  rols: S_ROL[],
  showModal: boolean,
  modalStatus: ModalStatus,
  setModal: Dispatch<SetStateAction<boolean>>,
  setUsers: Dispatch<SetStateAction<User[]>>,
}

export type NewExit = P_SAL

type ChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLSelectElement>

const { CARGA, DESCARGA, TICKET_DE_SALIDA, DEVOLUCION } = ACTION
const { ADMIN, SUPERVISOR_BALANZA } = ROLS

const UsersModal = ({ rols, user, showModal, modalStatus, setModal, setUsers }: Props) => {

  const [loading, setLoading] = useState<boolean>(false)

  const [alert, handleAlert] = useNotification()
  const [confirm, handleConfirm] = useNotification()

  const [selectedUser, setSelectedUser] = useState<User>(defaultUser)
  const [rolsOptions, setRols] = useState<SelectOptions[]>([])

  useEffect(() => {
    const rolsOptions: SelectOptions[] = rols.map(({ ROL_DES, ROL_COD }) => {
      return {
        name: ROL_DES,
        value: ROL_COD,
      }
    })
    setRols(rolsOptions)
    setSelectedUser(user)
  }, [user])

  const { nombre, cedula, email, ficha, accountName, status } = selectedUser

  const handleOpenModal: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const validateFields = (onValidate: () => void) => {

      type ValidationField = {
        condition: RegExp,
        value: string | number | null,
        alert: OpenProps
      }

      const fieldsToValidate: ValidationField[] = [
        {
          condition: /^[a-zA-Z0-9._%+-]+@kraftheinz\.com$/,
          value: email,
          alert: {
            type: "warning",
            title: "Correo de Usuario",
            message: `Por favor, ingrese un correo electrónico válido de la forma usuario@kraftheinz.com`,
          }
        },
        {
          condition: /^\d{1,8}$/,
          value: cedula,
          alert: {
            type: "warning",
            title: "Cédula de Usuario",
            message: `Por favor, ingrese un número de cédula válido (máximo 8 dígitos)`,
          }
        },
        {
          condition: /^\d{1,5}$/,
          value: ficha,
          alert: {
            type: "warning",
            title: "Ficha de Usuario",
            message: `Por favor, ingrese un número de ficha válido (máximo 5 dígitos)`,
          }
        },
      ]

      const fieldUnvalidated = fieldsToValidate.find(({ condition, value, alert }) => {
        return !condition.test(value as string)
      })

      if (fieldUnvalidated) {
        const { alert } = fieldUnvalidated
        handleAlert.open(alert)
      } else {
        onValidate()
      }

    }

    validateFields(() => {
      handleConfirm.open({
        type: "warning",
        title: "Advertencia",
        message: "¿Estás seguro de que quieres guardar los cambios del usuario?"
      })
    })

  }

  const handleSubmit = async () => {
    const { email } = user
      try {
        setLoading(true)
        debugger
        const form = new FormData(document.getElementById("user-form") as HTMLFormElement)

        const rol = form.get("rol") as string
        console.log(rol)

        const userStatus = form.get("userStatus") as string
        console.log(userStatus)

        const userInfo: User = {
          ...selectedUser,
          rol: rol,
          status: Boolean(parseInt(userStatus))
        }

        let usersWithSameUniqueValues = await getUsers({
          email: selectedUser.email,
          cedula,
          ficha,
          accountName
        })
        debugger
        const foundUsers = usersWithSameUniqueValues.filter((foundUser) => foundUser.email !== email)

        if (!foundUsers.length) {

          if (modalStatus === "CREATE") {
            await createUser(userInfo)
            setUsers((users) => {
              const updatedUser = [...users]
              updatedUser.push(userInfo)
              return updatedUser
            })
          }

          if (modalStatus === "UPDATE" && email) {
            await updateUser({
              email,
              userInfo,
            })
            setUsers((users) => users.map((updatedUser) =>
              (updatedUser.email === user.email) ? userInfo : updatedUser
            ))
          }

          handleAlert.open(({
            type: "success",
            title: `${modalStatus === "CREATE" ? "Creación" : "Modificación"} de Usuario`,
            message: `Se han procesado los cambios del usuario exitosamente"`,
          }))

          setTimeout(() => setModal(false), 3000)

        } else {
          const foundUsersEmails = foundUsers.map(({ email }) => email).join(", ")
          handleAlert.open(({
            type: "warning",
            title: "Duplicados de valores únicos",
            message: `Has intentado guardar valores únicos que pertenecen a otros usuarios, revisar los siguientes: (${foundUsersEmails})`,
          }))
          setLoading(false)
        }

      } catch (error) {
        console.log(error)
        setLoading(false)
        handleAlert.open(({
          type: "danger",
          title: "Error ❌",
          message: "Ha habido un error procesando la salida del vehículo, intentelo de nuevo",
        }))
      }
  }

  const handleChange: ChangeHandler = async (event) => {
    const target = event.target
    const { name, value } = target

    setSelectedUser({
      ...selectedUser,
      [name]: value,
    })
  }

  const userStatus = [
    {
      id: "active",
      title: "Activo",
      value: 1,
    },
    {
      id: "inactive",
      title: "Inactivo",
      value: 0,
    },
  ]

  return (
    <>
      <Modal
        {...{ showModal, setModal }}
        className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_650px)]"
      >
        <h1 className="font-semibold pb-10">{modalStatus === "CREATE" ? "Creación" : "Modificación"} de Usuario</h1>
        <Form
          id="user-form"
          className='grid grid-cols-2 gap-x-5 gap-y-8'
          onSubmit={handleOpenModal}
        >

          <Input
            id="nombre"
            value={nombre || ""}
            className="w-full"
            title="Nombre"
            placeholder="ORLANDO MENDOZA"
            onChange={handleChange}
          />

          <Input
            id="email"
            value={email || ""}
            className="w-full"
            type="email"
            title="Email"
            placeholder="alexander.rodriguez@kraftheinz.com"
            onChange={handleChange}
          />

          <Input
            id="cedula"
            value={cedula || ""}
            className="w-full"
            title="Cedula"
            type="number"
            maxLength={8}
            placeholder="27313279"
            pattern="^\d{1,8}$"
            onChange={handleChange}
          />

          <Input
            id="ficha"
            value={ficha || ""}
            className="w-full"
            title="Ficha"
            type="number"
            maxLength={5}
            placeholder="14394"
            pattern="^\d{1,5}$"
            onChange={handleChange}
          />

          <label htmlFor="rol" className="Input">
            <span>Tipo de usuario</span>
            <select name="rol" id="rol" required>
              {
                rolsOptions.map(({ name, value }, index) => {
                  const selected = (selectedUser.rol === value)
                  return (
                    <option selected={selected} value={value} key={`name-${index}`}>
                      {name}
                    </option>
                  )
                })
              }
            </select>
          </label>

          <Input
            id="accountName"
            value={accountName || ""}
            className="w-full"
            title="Account Name"
            placeholder="14394"
            disabled={modalStatus === "UPDATE"}
            onChange={handleChange}
          />

          <div className="col-start-2">
            <span className="block pb-5">Status de usuario:</span>
            <div className="flex items-center gap-x-5">
              {
                userStatus.map(({ id, title, value }) =>
                  <label htmlFor={id} key={id}>
                    <input
                      id={id}
                      name="userStatus"
                      type="radio"
                      onChange={handleChange}
                      className="mr-2"
                      required
                      value={value}
                      defaultChecked={status === Boolean(value)}
                    />
                    <span>{title}</span>
                  </label>
                )
              }
            </div>
          </div>

          <Button type="submit" loading={loading} className="bg-secondary col-span-2">
            Guardar
          </Button>

        </Form>
      </Modal>
      <NotificationModal alertProps={[alert, handleAlert]} />
      <ConfirmModal
        acceptAction={handleSubmit}
        confirmProps={[confirm, handleConfirm]}
      />
    </>
  )
}

export default UsersModal
