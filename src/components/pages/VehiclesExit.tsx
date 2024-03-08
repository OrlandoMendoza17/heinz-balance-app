import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Select, { SelectOptions } from '../widgets/Select'
import { getDestination, getOperation } from '@/services/plant'
import Modal from '../widgets/Modal'
import Button from '../widgets/Button'
import Input from '../widgets/Input'
import Textarea from '../widgets/Textarea'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
}

const VehiclesExit = ({ showModal, setModal }: Props) => {

  const [operations, setOperations] = useState<SelectOptions[]>([])
  const [destinations, setDestinations] = useState<SelectOptions[]>([])

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

  return (
    <Modal className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_750px)]" {...{ showModal, setModal }}>
      <h1 className="font-semibold pb-10">Procesar Salida de Vehículo</h1>
      <div className='grid grid-cols-2 gap-x-5 gap-y-8'>

        <Input
          id="truckPlate"
          value={""}
          className="w-full"
          title="Placa del Vehículo"
          placeholder="A7371V"
          onChange={() => { }}
        />

        <Input
          id="cedula"
          value={""}
          className="w-full"
          title="Cédula del Chofer"
          placeholder="27313279"
          onChange={() => { }}
        />

        <span className="col-span-">A7371V - CAMION NPR - ALIMENTOS LOS GIRALDA</span>
        <span className="col-span-">27313279 - Orlando Mendoza</span>

        <Input
          id="origin"
          value={""}
          className="w-full"
          title="Procedencia"
          placeholder="VALENCIA"
          onChange={() => { }}
        />

        <Input
          id="invoice"
          value={""}
          className="w-full"
          title="Factura"
          placeholder=""
          onChange={() => { }}
        />

        <Select
          title="Destino"
          defaultOption="Destino"
          options={destinations}
          onChange={() => { }}
        />

        <Select
          title="Operación"
          defaultOption="Operación"
          options={operations}
          onChange={() => { }}
        />
        
        <div className="grid grid-cols-[1fr_auto] items-end">
          <Input
            id="truckWeight"
            value={""}
            className="w-full !rounded-r-none"
            title="Peso Tara"
            placeholder=""
            onChange={() => { }}
          />
          <Button className='bg-secondary !rounded-l-none' style={{ maxHeight: "41px" }} onClick={() => { }}>
            Leer Peso
          </Button>
        </div>
        
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