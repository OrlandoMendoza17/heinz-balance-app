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

type Props = {
  handleModal: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ]
}

const SearchExitsModal = ({ handleModal }: Props) => {

  const [loading, setLoading] = useState<boolean>(false)
  const [showModal, setModal] = handleModal

  const [searchBy, setSearchBy] = useState<GetExitsBodyProps>({
    dateFrom: "",
    dateTo: "",
    cedula: "",
    plate: "",
    entryNumber: "",
  })

  const [exits, setExits] = useState<Exit[]>([])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      setExits([])
      const { dateFrom, dateTo } = searchBy

      const body = {
        ...searchBy,
        dateFrom: dateFrom ? getDateTime(new Date(dateFrom).toISOString()) : "",
        dateTo: dateTo ? getDateTime(new Date(dateTo).toISOString()) : "",
      }

      console.log('body', body)

      const exits = await getExits(body)
      setExits(exits.map(({ exitDate, entryDate, ...rest }) => (
        {
          ...rest,
          entryDate: entryDate.replace("T", " ").replace("Z", ""),
          exitDate: exitDate.replace("T", " ").replace("Z", ""),
        }
      )))

      setLoading(false)

    } catch (error) {
      setLoading(false)
      console.log('error', error)
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {

    const { name, value } = target

    setSearchBy({
      ...searchBy,
      [name]: value
    })
  }

  const { dateFrom, dateTo } = searchBy

  return (
    <Modal className="SearchExitModal" {...{ showModal, setModal }}>
      <h2 className="font-bold pb-10">Buscar Salidas de Vehículos</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          id="entryNumber"
          type="text"
          // value={dateFrom}
          className="w-full"
          title="Número de entrada:"
          placeholder="95216"
          onChange={handleChange}
          required={false}
        />
        <Input
          id="plate"
          type="text"
          // value={dateFrom}
          className="w-full"
          title="Placa:"
          placeholder="A7371V"
          onChange={handleChange}
          required={false}
        />
        <Input
          id="cedula"
          type="text"
          // value={dateFrom}
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
          exits.length &&
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
                exits.map((exit) =>
                  <TRExits exit={exit} />
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
                <Spinner size="normal" />
                :
                "No se ha encontrado ningúna salida"
            }
          </div>
        }
      </section>
    </Modal>
  )
}

export default SearchExitsModal