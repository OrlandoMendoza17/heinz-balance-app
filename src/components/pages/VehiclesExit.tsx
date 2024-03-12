import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Select, { SelectOptions } from '../widgets/Select'
import { getDestination, getOperation } from '@/services/plant'
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

  const [operations, setOperations] = useState<SelectOptions[]>([])
  const [destinations, setDestinations] = useState<SelectOptions[]>([])

  const [selectedTransport, setSelectedTransport] = useState<Entry>({
    entryNumber: "",
    driver: {
      name: "",
      cedula: "",
      code: "",
    },
    vehicule: {
      plate: "",
      model: "",
      type: "",
      capacity: 0,
      company: "",
    },
    destination: "D01",
    entryDate: "",
    origin: "",
    truckWeight: 0,
    grossWeight: 0,
    netWeight: 0,
  })
  
  useEffect(() => {
    (async () => {
      try {

        // const data = await getDestination()
        const destinations = await getDestination()
        console.log("Destinations: ", destinations)

        const operations = await getOperation()
        console.log("Operations: ", operations)

        const destinationOptions: SelectOptions[] = destinations.map(({ DES_COD, DES_DES }) => {
          return {
            name: DES_DES,
            value: DES_COD,
          }
        })

        const operationOptions: SelectOptions[] = operations.map(({ OPE_COD, OPE_DES }) => {
          return {
            name: OPE_DES,
            value: OPE_COD,
          }
        })

        setDestinations(destinationOptions)
        setOperations(operationOptions)

      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  
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