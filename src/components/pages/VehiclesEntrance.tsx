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

  const [newEntry, setNewEntry] = useState<Omit<Entry, "entryNumber" | "entryDate" | "vehicule" | "driver" | "grossWeight" | "netWeight">>({
    destination: "D01",
    operation: "",
    invoice: "",
    origin: "",
    truckWeight: 0,
    details: "",
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

    const { destination } = newEntry; // Destiny code 

    const table_values = {
      "D01": {
        ENT_NUM: "",           
        USU_LOG: "",            
        ENT_DI_FEC: "",        
        ENT_DI_PRO: "",         
        ENT_DI_GUI: "",         
        ENT_DI_PLA: "",         
        ENT_DI_NDE: "",         
        ENT_DI_PAL: "", 
        ENT_DI_PNC: 0,       
        ENT_DI_CPA: 0,         
        ENT_DI_PPA: 0,         
        ENT_DI_DES: "",         
        ENT_DI_PAD: 0,         
        ENT_DI_DPA: "",
        ENT_DI_STA: 1,        
        ENT_DI_OBS: "",  
        ENT_DI_AUT: "",   
        ENT_DI_REV: true
      },
      "D02": {
        ENT_NUM: "",           
        ENT_MP_PRO: "",         
        ENT_MP_FAC: "",  
        ENT_MP_NOT: null,           
        ENT_MP_PAL: null 
      },
      "D03": {
        ENT_NUM:"",
        ENT_SG_PRO: "",
        ENT_SG_FAC: "",
        ENT_SG_NOT: null,
        ENT_SG_AUT: null,
        ENT_SG_NDE: null
      },
      "D04": {
        ENT_NUM: "",
        ENT_ALM_PRO: "",
        ENT_ALM_FAC: "",
      },
      "D05": {
        ENT_PRO: "",
        OPE_COD: "",  
        ENT_NUM: "",
        MAT_COD: ""
      },
      "D07": {
        ENT_NUM: "",           
        ENT_OS_PRO: "",        
        ENT_OS_AUT: ""
      },
    }

    const EntryValue = {
      ENT_NUM:"",        
      ENT_FEC:"",       
      USU_LOG:"",        
      VEH_ID:"",         
      CON_COD:"",       
      DES_COD: destination,        
      OPE_COD:"",       
      ENT_PES_TAR: 0,    
      EMP_ID: "",  
      ENT_OBS:"",
      ENT_FLW: 0,      
      ENT_FEC_COL:"",    
      ENT_FLW_ACC: 0    
    }

    const value =  table_values[destination]
    return [EntryValue, value];
  }

  const handleChange: ChangeHandler = async ({ target }) => {
    setNewEntry({
      ...newEntry,
      [target.id]: target.value,
    })
  }

  const { origin, invoice, truckWeight, details } = newEntry

  return (
    <>
      <Modal className='py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_750px)]' {...{ showModal, setModal }}>
        <h1 className="font-semibold pb-10">Procesar Entrada de Vehículo</h1>
        <Form
          onSubmit={handleSubmit}
          className='grid grid-cols-2 gap-x-5 gap-y-8'
        >

          <>
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
          </>

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
            value={details}
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