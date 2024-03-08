import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from 'react'
import Input from '../widgets/Input'
import Modal from '../widgets/Modal'
import Button from '../widgets/Button'
import Form from '../widgets/Form'
import Textarea from '../widgets/Textarea'
import Select, { SelectOptions } from '../widgets/Select'
import VehiculeEntranceSearch from './VehiculeEntranceSearch'
import { getDestination, getOperation } from '@/services/plant'
import { getDriver, getVehicule } from '@/services/transportInfo'
import { AxiosError } from 'axios'
import getErrorMessage from '@/utils/services/errorMessages'
import NotificationModal from '../widgets/NotificationModal'
import useNotification from '@/hooks/useNotification'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
}

type ChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>

const VehiclesEntrance = ({ showModal, setModal }: Props) => {

  const [alert, handleAlert] = useNotification()
  
  const [operations, setOperations] = useState<SelectOptions[]>([])
  const [destinations, setDestinations] = useState<SelectOptions[]>([])

  const [driver, setDriver] = useState<Driver>()
  const [vehicule, setVehicule] = useState<Vehicule>()

  const [entry, setEntry] = useState({
    origin: "",
    invoice: "",
    truckWeight: 0,
    destination: "",
    operation: "",
    details: "",
  })

  const { origin, invoice, truckWeight } = entry

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
  
  const searchVehicule = async (vehiculePlate: string) => {

    setVehicule(undefined)
    const vehicule = await getVehicule(vehiculePlate)
    setVehicule(vehicule)

  }
  
  const searchDriver = async (driverPersonalID: string) => {

    setDriver(undefined)
    const driver = await getDriver(driverPersonalID)
    setDriver(driver)

  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
  }

  const handleChange: ChangeHandler = async ({ target }) => {
    setEntry({
      ...entry,
      [target.id]: target.value,
    })
  }

  return (
    <>
      <Modal className='py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_750px)]' {...{ showModal, setModal }}>
        <h1 className="font-semibold pb-10">Procesar Entrada de Vehículo</h1>
        <Form
          onSubmit={handleSubmit}
          className='grid grid-cols-2 gap-x-5 gap-y-8'
        >

          <VehiculeEntranceSearch
            id="vehiculePlate"
            title="Placa del Vehículo"
            placeholder="A7371V"
            searchInfo={searchVehicule}
          />

          <VehiculeEntranceSearch
            id="driverPersonalID"
            title="Cédula del Chofer"
            placeholder="27313279"
            searchInfo={searchDriver}
          />

          {
            (driver || vehicule) &&
            <div className="col-span-2 grid grid-cols-2 gap-x-5 text-secondary">
              {
                vehicule &&
                <span className="col-start-1 row-start-1">
                  {vehicule.plate} - {vehicule.model} - {vehicule.company}
                </span>
              }
              {
                driver &&
                <span className="col-start-2 row-start-1">
                  {driver.cedula} - {driver.name}
                </span>
              }
            </div>
          }

          <Input
            id="origin"
            value={origin}
            className="w-full"
            title="Procedencia"
            placeholder="VALENCIA"
            onChange={handleChange}
          />

          <Input
            id="invoice"
            value={invoice}
            className="w-full"
            title="Factura"
            placeholder=""
            onChange={handleChange}
          />

          <Select
            id="destination"
            title="Destino"
            defaultOption="Destino"
            options={destinations}
            onChange={handleChange}
          />

          <Select
            id="operation"
            title="Operación"
            defaultOption="Operación"
            options={operations}
            onChange={handleChange}
          />

          <div className="grid grid-cols-[1fr_auto] items-end">
            <Input
              id="truckWeight"
              value={truckWeight}
              type='number'
              className="w-full !rounded-r-none"
              title="Peso Tara"
              placeholder="0.00"
              onChange={handleChange}
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
            onChange={handleChange}
            placeholder="📝 ..."
            required={false}
          />

        </Form>
      </Modal>
      <NotificationModal alertProps={[alert, handleAlert]} />
    </>
  )
}

export default VehiclesEntrance