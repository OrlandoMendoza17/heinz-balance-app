import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from 'react'
import Modal from '../widgets/Modal'
import Form from '../widgets/Form'
import Input from '../widgets/Input'
import Button from '../widgets/Button'
import { getTransports } from '@/services/transportInfo'
import TransportRows from './TransportRows'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  selectedTransport: Transport | undefined,
  setSelectedTransport: Dispatch<SetStateAction<Transport | undefined>>,
}

const SearchTransport = ({ showModal, setModal, selectedTransport, setSelectedTransport }: Props) => {

  const [loading, setLoading] = useState<boolean>(false)
  const [searched, setSearched] = useState<boolean>(false)

  const [state, setState] = useState<{ name: string }>({
    name: "",
  })

  const [transports, setTransports] = useState<Transport[]>([])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {

      setLoading(true)
      setSearched(false)

      const { name } = state

      const transports = await getTransports(name)
      setTransports(transports)

      setSearched(true)
      setLoading(false)

    } catch (error) {
      setLoading(false)
      console.log('error', error)
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setState({
      ...state,
      [target.name]: target.value
    })
  }

  return (
    <Modal
      showModal={showModal}
      setModal={setModal}
      targetModal="TransportModal"
    >
      <main className="grid">

        <h5 className="font-semibold pb-10">Buscar transporte</h5>
        <Form
          onSubmit={handleSubmit}
          className="pb-10"
        >
          <div className="grid grid-cols-[1fr_auto] gap-5">
            <Input
              id="name"
              value={state.name}
              className="w-full"
              title="Nombre de Tranporte"
              placeholder=""
              onChange={handleChange}
            />
            <Button type="submit" className="bg-secondary self-end" loading={loading}>
              Buscar
            </Button>
          </div>
        </Form>
        {
          searched &&
          <table className="TransportVehicule">
            <thead>
              <tr>
                <th>Código</th>
                <th>RIF</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {
                transports.map((transport, i) =>
                  <TransportRows key={i} {...{ transport, selectedTransport, setSelectedTransport }} />
                )
              }
            </tbody>
          </table>
        }
        {
          searched && selectedTransport &&
          <div className="justify-self-end flex gap-5">

            <Button
              onClick={() => {
                setTransports([])
                setSearched(false)
                setSelectedTransport(undefined)
              }}
              className="bg-slate-500 mt-10 !px-10"
            >
              Limpiar
            </Button>
            <Button
              onClick={() => setModal(false)}
              className="bg-secondary mt-10 !px-10"
            >
              Aceptar
            </Button>
          </div>
        }
      </main>
    </Modal>
  )
}

export default SearchTransport