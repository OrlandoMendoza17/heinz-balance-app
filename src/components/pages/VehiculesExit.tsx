import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Select, { SelectOptions } from '../widgets/Select'
import { getDestination } from '@/services/destination'
import Modal from '../widgets/Modal'
import Button from '../widgets/Button'
import Input from '../widgets/Input'
import Textarea from '../widgets/Textarea'
import { shortDate } from '@/utils/parseDate'
import { DESTINATION_BY_CODE } from '@/lib/enums'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  entry: Entry
}

const VehiclesExit = ({ showModal, setModal, entry }: Props) => {

  const [selectedTransport, setSelectedTransport] = useState<Entry>({
    entryNumber: "",
    driver: {
      name: "",
      cedula: "",
      code: "",
    },
    vehicule: {
      id: "",
      plate: "",
      model: "",
      type: "",
      capacity: 0,
      company: "",
    },
    destination: "D01",
    operation: "",
    entryDate: "",
    origin: "",
    truckWeight: 0,
    grossWeight: 0,
    netWeight: 0,
    invoice: null,
    details: "",
  })

  const { entryNumber, vehicule, driver, entryDate, destination } = entry

  return (
    <Modal className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_750px)]" {...{ showModal, setModal }}>
      <h1 className="font-semibold pb-10">Procesar Salida de Vehículo</h1>
      <div className='grid grid-cols-2 gap-x-5 gap-y-8'>

        <ul>
          <li>Código de entrada: {entryNumber}</li>
          <li>Placa del Vehículo: {vehicule.plate}</li>
          <li>Cédula del Chofer: {driver.cedula}</li>
          <li>Procedencia: {driver.cedula}</li>
          <li>Fecha de Entrada: {shortDate(entryDate)}</li>
          <li>Procedencia: ?</li>
          <li>Destino: {DESTINATION_BY_CODE[destination]}</li>
          <li>Operación: {DESTINATION_BY_CODE[destination]}</li>
          <li>Peso Tara: {entry.truckWeight}</li>
          <li>Peso Bruto: {entry.grossWeight}</li>
          <li>Peso Neto : {entry.netWeight}</li>
        </ul>
        
        <Textarea
          id="details"
          value={""}
          title="Observaciones en entrada"
          className="col-span-2"
          onChange={() => { }}
          placeholder="📝 ..."
          required={false}
        />
        
      </div>
    </Modal>
  )
}

export default VehiclesExit