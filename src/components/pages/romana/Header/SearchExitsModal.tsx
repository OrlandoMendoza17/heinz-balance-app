import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from 'react'
import Modal from '../../../widgets/Modal'
import Input from '../../../widgets/Input'
import { getCuteFullDate, getDateTime } from '@/utils/parseDate'
import Form from '../../../widgets/Form'
import { getExits } from '@/services/exits'
import Button from '../../../widgets/Button'
import TRExits from './TRExits'
import Spinner from '../../../widgets/Spinner'
import { GetExitsBodyProps } from '@/pages/api/exits'
import useNotification from '@/hooks/useNotification'
import NotificationModal from '@/components/widgets/NotificationModal'

type Props = {
  handleModal: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ]
}

const initialSearchValue = {
  dateFrom: "",
  dateTo: "",
  cedula: "",
  plate: "",
  entryNumber: "",
}

const SearchExitsModal = ({ handleModal }: Props) => {

  const [loading, setLoading] = useState<boolean>(false)
  const [showModal, setModal] = handleModal

  const [alert, handleAlert] = useNotification()

  const [searchBy, setSearchBy] = useState<GetExitsBodyProps>(initialSearchValue)

  const [exits, setExits] = useState<Exit[]>([])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    debugger
    const filters = Object.values(searchBy).filter((value) => Boolean(value)).length
    if (filters) {
      try {
        setLoading(true)
        setExits([])

        const SECONDS = 10
        const { dateFrom, dateTo } = searchBy

        const timeID = setTimeout(() => {
          handleAlert.open(({
            type: "warning",
            title: "⚠️Búsqueda pesada⚠️",
            message: "Es posible que la búsqueda tarde más de lo esperado...",
          }))
        }, SECONDS * 1000)

        const body = {
          ...searchBy,
          dateFrom: dateFrom ? getDateTime(new Date(dateFrom).toISOString()) : "",
          dateTo: dateTo ? getDateTime(new Date(dateTo).toISOString()) : "",
        }

        console.log('body', body)

        const exits = await getExits(body)
        setExits(exits)

        clearTimeout(timeID)

        setLoading(false)

      } catch (error) {
        setLoading(false)
        console.log('error', error)
        handleAlert.open(({
          type: "danger",
          title: "Error ❌",
          message: "Ha habido un error buscando las salidas",
        }))
      }
    } else {
      handleAlert.open(({
        type: "warning",
        title: "Filtros Vacíos ⚠️",
        message: "Debes colocar al menos un filtro para hacer la búsqueda",
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

  const { entryNumber, plate, cedula, dateFrom, dateTo } = searchBy

  return (
    <Modal className="SearchExitModal" {...{ showModal, setModal }}>
      <div className="flex gap-4">
        <h2 className="font-bold pb-10">Buscar Salidas de Vehículos</h2>
        <button
          onClick={() => setSearchBy(initialSearchValue)}
          className="text-white bg-slate-400 hover:bg-slate-500 py-2 px-4 self-start font-bold rounded-lg uppercase">
          Reiniciar Filtros
        </button>
      </div>
      <Form onSubmit={handleSubmit}>
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
        <Button loading={loading} noSpinner={true} type="submit" className="bg-secondary self-end">
          Buscar
        </Button>
      </Form>
      <section className="">
        {
          Boolean(exits.length) &&
          <span className="!text-base">Resultados: {exits.length}</span>
        }
        {
          !loading && Boolean(exits.length) &&
          <table className="SearchTable">
            <thead>
              <tr>
                <th>N° Entrada</th>
                {/* <th>Transporte</th> */}
                <th>Placa</th>
                <th>Nombre</th>
                <th>Cedula</th>
                {/* <th>Fecha de Entrada</th> */}
                <th>Fecha de Salida</th>
                <th>Peso Bruto (KG)</th>
                <th>Destino</th>
              </tr>
            </thead>
            <tbody>
              {
                exits.map((exit, i) =>
                  <TRExits key={i} exit={exit} />
                )
              }
            </tbody>
          </table>
        }
        {
          !Boolean(exits.length) &&
          <div className="Loading-Slot">
            {
              loading ?
                <Spinner size="normal" /> : "No se ha encontrado ningúna salida"
            }
          </div>
        }

        <NotificationModal alertProps={[alert, handleAlert]} />
      </section>
    </Modal>
  )
}

export default SearchExitsModal