import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from 'react'
import Input from '../widgets/Input'
import Modal from '../widgets/Modal'
import Button from '../widgets/Button'
import Form from '../widgets/Form'
import Textarea from '../widgets/Textarea'
import Select, { SelectOptions } from '../widgets/Select'
import VehiculeEntranceSearch from './VehiculeEntranceSearch'
import { getDestination } from '@/services/destination'
import { getDriver, getVehicule } from '@/services/transportInfo'
import { AxiosError } from 'axios'
import getErrorMessage from '@/utils/services/errorMessages'
import NotificationModal from '../widgets/NotificationModal'
import useNotification from '@/hooks/useNotification'
import { INVOICE_BY_CODE } from '@/lib/enums'
import { de } from 'date-fns/locale'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
}

type ChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
type DestinationSelectValue = { DES_COD: DES_COD, OPE_COD: string }

type TABLE_VALUES = {
  D01: Omit<P_ENT_DI, "ENT_NUM">
  D02: P_ENT_MP
  D03: P_ENT_SG
  D04: P_ENT_ALM
  D05: P_ENT_MAT
  D07: P_ENT_OS
}

const VehiculesEntrance = ({ showModal, setModal }: Props) => {

  const [alert, handleAlert] = useNotification()
  const [enableInvoice, setEnableInvoice] = useState<Boolean>(false)

  const [destinations, setDestinations] = useState<SelectOptions[]>([])

  const [driver, setDriver] = useState<Driver>()
  const [vehicule, setVehicule] = useState<Vehicule>()

  const [newEntry, setNewEntry] = useState<NewEntryDto>({
    destination: "",
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
        console.log("Operations: ", destinations)

        const operationOptions: SelectOptions[] = destinations.map(({ DES_DES, OPE_COD, DES_COD }) => {
          
          const value: DestinationSelectValue = {
            DES_COD,
            OPE_COD,
          }
          
          return {
            name: DES_DES,
            value: JSON.stringify(value),
          }
        })

        setDestinations(operationOptions)

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
    const {DES_COD, OPE_COD}: DestinationSelectValue = JSON.parse(destination)
    
    const table_values: TABLE_VALUES = {
      "D01": {
        // ENT_NUM: "",  // Si es auto incremental, no se manda
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

    const EntryValue: P_ENT = {
      ENT_NUM:"",        
      ENT_FEC:"",       
      USU_LOG:"",        
      VEH_ID:"",         
      CON_COD:"",       
      DES_COD,        
      OPE_COD:"",       
      ENT_PES_TAR: 0,    
      EMP_ID: "",  
      ENT_OBS:"",
      ENT_FLW: 0,      
      ENT_FEC_COL:"",    
      ENT_FLW_ACC: 0    
    }
    
    const value =  table_values[DES_COD]
  }

  const handleChange: ChangeHandler = async ({ target }) => {
    type DESTINATION_VALUES = { DES_COD: DES_COD, OPE_COD: string }

    let invoice = newEntry.invoice
    
    if (target.name === "destination") {
      const { DES_COD }: DESTINATION_VALUES = JSON.parse(target.value)
      
      const REQUIRES_INVOICE = Boolean(INVOICE_BY_CODE[DES_COD])
      setEnableInvoice(REQUIRES_INVOICE)
      
      invoice = REQUIRES_INVOICE ? newEntry.invoice : undefined
    }

    setNewEntry({
      ...newEntry,
      invoice,
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

          <Input
            id="origin"
            value={origin}
            className="w-full"
            title="Procedencia"
            placeholder="VALENCIA"
            onChange={handleChange}
          />

          <Select
            name="destination"
            title="Destino"
            defaultOption="Destino"
            options={destinations}
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

          {
            enableInvoice &&
            <Input
              id="invoice"
              value={invoice}
              className="w-full"
              title="Factura"
              placeholder=""
              onChange={handleChange}
            />
          }

          <Textarea
            id="details"
            value={details}
            title="Observaciones en entrada"
            className="col-span-2"
            onChange={handleChange}
            placeholder="📝 ..."
            required={false}
          />
          
          <div>
            <input type="radio" />
            <input type="radio" />
            <input type="radio" />
          </div>
          
          <Button type="submit" className="bg-secondary col-span-2">Procesar</Button>

        </Form>
      </Modal>
      <NotificationModal alertProps={[alert, handleAlert]} />
    </>
  )
}

export default VehiculesEntrance