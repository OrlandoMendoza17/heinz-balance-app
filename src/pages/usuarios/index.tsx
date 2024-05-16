import React, { MouseEventHandler, useEffect, useState } from 'react'
import Header from '@/components/widgets/Header'
import NoEntries from '@/components/widgets/NoEntries';
import NotificationModal from '@/components/widgets/NotificationModal';
import Spinner from '@/components/widgets/Spinner';
import useAuth from '@/hooks/useAuth';
import useNotification from '@/hooks/useNotification';
import { ROLS } from '@/lib/enums';
import { useRouter } from 'next/router';
import { getRols, getUsers } from '@/services/user';
import TableUsers from '@/components/pages/TableUsers';
import defaultUser from '@/utils/defaultValues/User';
import UsersModal, { ModalStatus } from './UsersModal';
import Button from '@/components/widgets/Button';

const { ADMIN } = ROLS

const Romana = () => {

  const [renderPage, credentials] = useAuth()

  const router = useRouter()

  const [showModal, setModal] = useState<boolean>(false)
  const [users, setUsers] = useState<User[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [alert, handleAlert] = useNotification()

  const [modalStatus, setModalStatus] = useState<ModalStatus>("CREATE")
  const [selectedUser, setSelectedUser] = useState<User>(defaultUser)

  const [rols, setRols] = useState<S_ROL[]>([])

  const { user } = credentials

  useEffect(() => {
    (async () => {
      if (renderPage) {
        if (user.rol === ADMIN) {

          getRegisteredUsers()

          const rols = (await getRols()) as S_ROL[]
          setRols(rols)

        } else {
          router.push("/distribucion/entradas")
        }
      }
    })()
  }, [renderPage])

  const getRegisteredUsers = async () => {
    try {
      setLoading(true)

      const users = await getUsers({})
      setUsers(users)

      setLoading(false)

    } catch (error) {
      setLoading(false)
      console.log(error)
      handleAlert.open(({
        type: "danger",
        title: "Error ❌",
        message: "Ha habido un error trayendose los usuarios, intentelo de nuevo",
      }))
    }
  }

  const handleCreate: MouseEventHandler<HTMLButtonElement> = () => {
    setModal(true)
    setModalStatus("CREATE")
    setSelectedUser(defaultUser)
  }

  return (
    renderPage &&
    <>
      <Header />
      <main className="Romana">
        {
          loading ?
            <div className="flex items-center justify-center fullscreen">
              <Spinner size="normal" />
            </div>
            :
            <section>
              <div className="flex items-center justify-between h-[50px] gap-5">
                <h1>Usuarios ({users.length})</h1>
                <Button
                  onClick={handleCreate}
                  className="bg-secondary font-semibold"
                >
                  Crear Usuario
                </Button>
              </div>
              <table className="Entries self-start">
                <thead>
                  <tr className="!text-start">
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Ficha</th>
                    <th>Cedula</th>
                    <th>Rol</th>
                    <th>AccountName</th>
                    <th className="text-center">Status</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    users.map((user, i) =>
                      <TableUsers
                        key={i}
                        rols={rols}
                        user={user}
                        setModal={setModal}
                        setUsers={setUsers}
                        handleAlert={handleAlert}
                        setModalStatus={setModalStatus}
                        setSelectedUser={setSelectedUser}
                      />
                    )
                  }
                </tbody>
              </table>
              {
                (!users.length && !loading) &&
                <NoEntries
                  className="pt-60 pb-0"
                  message='No existe ningún usuario'
                />
              }
            </section>
        }
        {
          showModal &&
          <UsersModal {...{ showModal, setModal, setUsers, modalStatus, user: selectedUser, rols }} />
        }
        <NotificationModal alertProps={[alert, handleAlert]} />
      </main>
    </>
  )
}

export default Romana