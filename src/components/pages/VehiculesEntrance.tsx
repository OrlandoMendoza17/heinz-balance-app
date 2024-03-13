import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from 'react'
import Input from '../widgets/Input'
import Modal from '../widgets/Modal'
import Button from '../widgets/Button'
import Form from '../widgets/Form'
import Textarea from '../widgets/Textarea'
import Select, { SelectOptions } from '../widgets/Select'
import VehiculeEntranceSearch from './VehiculeEntranceSearch'
import NotificationModal from '../widgets/NotificationModal'
import useNotification from '@/hooks/useNotification'
import { getDestination } from '@/services/destination'
import { getDriver, getVehicule } from '@/services/transportInfo'
import { INVOICE_BY_CODE } from '@/lib/enums'
import { createNewEntry } from '@/services/entries'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
}

type ChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
type DestinationSelectValue = { DES_COD: DES_COD, OPE_COD: string }

type TABLE_VALUES = {
  D01: Omit<P_ENT_DI, "ENT_NUM">
  D02: Omit<P_ENT_MP, "ENT_NUM">,
  D03: Omit<P_ENT_SG, "ENT_NUM">,
  D04: Omit<P_ENT_ALM, "ENT_NUM">,
  D05: Omit<P_ENT_MAT, "ENT_NUM">,
  D07: Omit<P_ENT_OS, "ENT_NUM">,
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
    try {
      
      const { destination, truckWeight, details, origin, invoice } = newEntry; // Destiny code 
      const { DES_COD, OPE_COD }: DestinationSelectValue = JSON.parse(destination)
      
      if (vehicule && driver) {
  
        const entry: Omit<P_ENT, "ENT_NUM"> = {
          // ENT_NUM: "",
          ENT_FEC: "",
          USU_LOG: "",
          VEH_ID: vehicule.id,
          CON_COD: driver.cedula,
          DES_COD,
          OPE_COD,
          ENT_PES_TAR: truckWeight,
          EMP_ID: null,
          ENT_OBS: details,
          ENT_FLW: 0,
          ENT_FEC_COL: "",
          ENT_FLW_ACC: 0,
        }
  
        const table_values: TABLE_VALUES = {
          "D01": {
            // ENT_NUM: "",  // Si es auto incremental, no se manda
            USU_LOG: "",
            ENT_DI_FEC: "",
            ENT_DI_PRO: origin,
            ENT_DI_GUI: null,
            ENT_DI_PLA: null,
            ENT_DI_NDE: null,
            ENT_DI_PAL: null,
            ENT_DI_PNC: null,
            ENT_DI_CPA: 0,
            ENT_DI_PPA: 0,
            ENT_DI_DES: DES_COD,
            ENT_DI_PAD: 0,
            ENT_DI_DPA: "",
            ENT_DI_STA: 1,
            ENT_DI_OBS: null,
            ENT_DI_AUT: null,
            ENT_DI_REV: true
          },
          "D02": { // ✅
            // ENT_NUM: "",
            ENT_MP_PRO: origin,
            ENT_MP_FAC: invoice,
            ENT_MP_NOT: null,
            ENT_MP_PAL: null
          },
          "D03": { // ✅
            // ENT_NUM: "",
            ENT_SG_PRO: origin,
            ENT_SG_FAC: invoice,
            ENT_SG_NOT: null,
            ENT_SG_AUT: null,
            ENT_SG_NDE: null
          },
          "D04": { // ✅
            // ENT_NUM: "",
            ENT_ALM_PRO: origin,
            ENT_ALM_FAC: invoice,
          },
          "D05": { // ✅
            // ENT_NUM: "",
            ENT_PRO: origin,
            OPE_COD,
            MAT_COD: null
          },
          "D07": { // ✅
            // ENT_NUM: "",
            ENT_OS_PRO: origin,
            ENT_OS_AUT: null
          },
        }
  
        const entryByDestination = table_values[DES_COD]
  
        await createNewEntry({ entry, entryByDestination })
        
        handleAlert.open(({
          type: "success",
          title: "Entrada de Vehículo",
          message: `Se ha procesado la entrada del vehículo exitosamente"`,
        }))
        
      }
    } catch (error) {
      console.log(error)
      handleAlert.open(({
        type: "danger",
        title: "Error ❌",
        message: "Ha habido un error procesando la entrada del vehículo, intentelo de nuevo",
      }))
    }

  }

  const handleChange: ChangeHandler = async ({ target }) => {
    type DESTINATION_VALUES = { DES_COD: DES_COD, OPE_COD: string }

    let invoice = newEntry.invoice

    if (target.name === "destination") {
      const { DES_COD }: DESTINATION_VALUES = JSON.parse(target.value)

      const REQUIRES_INVOICE = Boolean(INVOICE_BY_CODE[DES_COD])
      setEnableInvoice(REQUIRES_INVOICE)

      invoice = REQUIRES_INVOICE ? newEntry.invoice : null
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
              value={invoice || ""}
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