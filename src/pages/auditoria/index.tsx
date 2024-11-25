import React, { ChangeEventHandler, FormEventHandler, MouseEventHandler, useEffect, useState } from 'react'
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
// import UsersModal, { ModalStatus } from './UsersModal';
import Button from '@/components/widgets/Button';
import { getEntryDifferences } from '@/services/entries';
import TableDifferences from '@/components/pages/auditoria/TableDifferences';
import { getExitDifferences } from '@/services/exits';
import generateExcel from '@/utils/generateExcel';
import Input from '@/components/widgets/Input';
import initialSearchValue from '@/utils/defaultValues/SearchValue';
import { BiSearchAlt } from 'react-icons/bi';
import Form from '@/components/widgets/Form';
import { getDateTime } from '@/utils/parseDate';

const { ADMIN, AUDITORIA } = ROLS

const Audit = () => {

  const [renderPage, credentials] = useAuth()

  const router = useRouter()

  const [exitDifferences, setExitDifferences] = useState<Exit[]>([])
  const [selectedExit, setSelectedExit] = useState<Exit[]>([])

  const [searchBy, setSearchBy] = useState(initialSearchValue)

  const [loading, setLoading] = useState<boolean>(false)
  const [alert, handleAlert] = useNotification()

  const { user } = credentials

  useEffect(() => {
    (async () => {
      if (renderPage) {
        if (user.rol === ADMIN || user.rol === AUDITORIA) {

          // getRegisteredUsers()

        } else {
          router.push("/distribucion/entradas")
        }
      }
    })()
  }, [renderPage])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      debugger
      const body = {
        ...searchBy,
        entryNumbers: entryNumber ? [entryNumber] : [],
        dateFrom: dateFrom ? getDateTime(new Date(dateFrom).toISOString()) : "",
        dateTo: dateTo ? getDateTime(new Date(dateTo).toISOString()) : "",
      }

      const exitDifferences = await getExitDifferences(body)
      setExitDifferences(exitDifferences)

      setLoading(false)

    } catch (error) {
      setLoading(false)
      console.error(error)
      handleAlert.open(({
        type: "danger",
        title: "Error ❌",
        message: "Ha habido un error buscando las salidas",
      }))
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {

    const { name, value } = target

    setSearchBy({
      ...searchBy,
      [name]: value
    })
  }

  // const differences = exitDifferences.map(({ entryDifference }) => entryDifference as EntryDif[]).flat()
  // console.log('differences', differences)

  const { entryNumber, plate, cedula, dateFrom, dateTo } = searchBy

  return (
    renderPage &&
    <>
      <Header />
      <main className="Romana Audit">
        {
          <section>
            <Form onSubmit={handleSubmit} className="grid grid-cols-[auto_1fr_auto] items-end justify-between gap-5">
              <div className="grid gap-4 justify-center">
                <h1>Auditoria ({exitDifferences.length})</h1>
                <button
                  type="button"
                  className="bg-slate-300 hover:bg-teal-600 px-4 py-2 rounded-full text-white text-sm font-bold"
                  onClick={() => generateExcel(exitDifferences)}
                >
                  Descargar todo
                </button>
              </div>
              <div className="Filter">
                <Input
                  id="entryNumber"
                  type="text"
                  value={entryNumber}
                  className="w-full"
                  title="Número de entrada:"
                  placeholder="95216"
                  onChange={handleChange}
                  required={false}
                />
                <Input
                  id="plate"
                  type="text"
                  value={plate}
                  className="w-full"
                  title="Placa:"
                  placeholder="A7371V"
                  onChange={handleChange}
                  required={false}
                />
                <Input
                  id="cedula"
                  type="text"
                  value={cedula}
                  className="w-full"
                  title="Cedula:"
                  placeholder="27313279"
                  onChange={handleChange}
                  required={false}
                />
                <Input
                  id="dateFrom"
                  type="datetime-local"
                  value={dateFrom}
                  className="w-full"
                  title="Desde:"
                  onChange={handleChange}
                  required={false}
                />
                <Input
                  id="dateTo"
                  type="datetime-local"
                  value={dateTo}
                  className="w-full"
                  title="Hasta:"
                  onChange={handleChange}
                  required={false}
                />
              </div>
              <div className="grid grid-rows-[1fr_1fr]">
                <button
                  type="button"
                  onClick={() => setSearchBy(initialSearchValue)}
                  className="text-white bg-slate-400 hover:bg-slate-500 py-2 px-4 self-start font-bold rounded-lg">
                  Reiniciar Filtros
                </button>
                <Button
                  type="submit"
                  className="bg-secondary font-semibold block w-full"
                >
                  <BiSearchAlt size={20} className="inline" /> Buscar
                </Button>
              </div>
            </Form>
            {
              loading ?
                <div className="flex items-center justify-center fullscreen">
                  <Spinner size="normal" />
                </div>
                :
                <table className="Entries self-start">
                  <thead>
                    <tr className="!text-start">
                      <th>N° de Entrada</th>
                      <th>Nombre</th>
                      <th>Cedula</th>
                      <th>Placa</th>
                      <th>Procedencia</th>
                      <th>Diferencias</th>
                      <th>Fecha de Salida</th>
                      <th>Usuario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      exitDifferences.map((exit, i) =>
                        <TableDifferences
                          key={i}
                          setSelectedExit={setSelectedExit}
                          exit={exit}
                        />
                      )
                    }
                  </tbody>
                </table>
            }
            {
              (!exitDifferences.length && !loading) &&
              <NoEntries
                className="pt-60 pb-0"
                message="No se consiguió ninguna diferencia"
              />
            }
          </section>
        }
        <NotificationModal alertProps={[alert, handleAlert]} />
      </main>
    </>
  )
}

export default Audit