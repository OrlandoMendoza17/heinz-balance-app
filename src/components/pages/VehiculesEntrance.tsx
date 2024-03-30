import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useRef, useState } from 'react'
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
import { getDriver, getDriverFromVehicule, getVehicule } from '@/services/transportInfo'
import { ACTION, INVOICE_BY_CODE, STATUS } from '@/lib/enums'
import { createNewEntry, getNextEntryNumber } from '@/services/entries'
import { format } from 'date-fns'
import { getDateTime } from '@/utils/parseDate'
import { DESTINATIONS } from '@/pages/api/destinations'
import CreateVehiculeModal from './CreateVehiculeModal'
import CreateDriverModal from './CreateDriverModal'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
}

type ChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
type DestinationSelectValue = { DES_COD: DES_COD, OPE_COD: string }
export type NewEntry = Omit<P_ENT, "ENT_NUM">

type TABLE_VALUES = {
  D01: P_ENT_DI,
  D02: P_ENT_MP,
  D03: P_ENT_SG,
  D04: P_ENT_ALM,
  D05: P_ENT_MAT,
  D07: P_ENT_OS,
}

const { CARGA, DESCARGA, DEVOLUCION } = ACTION

const VehiculesEntrance = ({ showModal, setModal }: Props) => {

  const [alert, handleAlert] = useNotification()
  
  const [showVehiculeModal, setVehiculeModal] = useState<boolean>(false)
  const [showDriverModal, setDriverModal] = useState<boolean>(false)

  const [disableDriver, setDisableDriver] = useState<boolean>(true)
  const [enableInvoice, setEnableInvoice] = useState<boolean>(false)

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
    aboutToLeave: false,
  })

  useEffect(() => {
    (async () => {
      try {

        const destinations: DESTINATIONS[] = [
          {
            DES_COD: 'D01',
            OPE_COD: 'OO9',
            DES_DES: 'DISTRIBUCIÓN',
          },
          {
            DES_COD: 'D02',
            OPE_COD: 'OO1',
            DES_DES: 'MATERIA PRIMA',
          },
          {
            DES_COD: 'D03',
            OPE_COD: 'OO2',
            DES_DES: 'SERVICIOS GENERALES',
          },
          {
            DES_COD: 'D04',
            OPE_COD: 'OO4',
            DES_DES: 'ALMACEN',
          },
          {
            DES_COD: 'D05',
            OPE_COD: 'OO5',
            DES_DES: 'MATERIALES',
          },
          {
            DES_COD: 'D07',
            OPE_COD: 'O10',
            DES_DES: 'OTROS SERVICIOS',
          },
        ]

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

  const handleCreateVehicule = async () =>{
    setVehiculeModal(true)
  }
  
  const handleCreateDriver = async () =>{
    setDriverModal(true)
  }
  
  const searchVehicule = async (vehiculePlate: string) => {

    // Antes de la busqueda se vuelve undefined para borrar los datos almacenados en el estado
    setVehicule(undefined)

    const vehicule = await getVehicule(vehiculePlate)
    setVehicule(vehicule)

    const driver = await getDriverFromVehicule(vehicule.id)
    setDriver(driver)
  }

  const searchDriver = async (driverID: string) => {

    // Antes de la busqueda se vuelve undefined para borrar los datos almacenados en el estado
    setDriver(undefined)

    const driver = await getDriver(driverID, "CON_CED")
    setDriver(driver)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const { currentTarget } = event
    try {

      const form = new FormData(currentTarget)

      const action = parseInt(form.get("action") as string) as ACTION
      const { truckWeight, details, origin, invoice } = newEntry; // Destiny code

      const { DES_COD, OPE_COD }: DestinationSelectValue = JSON.parse(form.get("destination") as string)
      debugger
      if (vehicule && driver) {

        const { nextEntryNumber: ENT_NUM } = await getNextEntryNumber()

        const entry: NewEntry = {
          // ENT_NUM: "", // Esto es auto incremental
          ENT_FEC: getDateTime(),
          USU_LOG: "USR9509C",
          VEH_ID: vehicule.id,
          CON_COD: driver.cedula,
          DES_COD,
          OPE_COD,
          ENT_PES_TAR: truckWeight,
          EMP_ID: null,
          ENT_OBS: (details !== "") ? details : null,
          ENT_FLW: (DES_COD === "D01" && action === ACTION.DEVOLUCION) ? STATUS.DISTRIBUTION : STATUS.ABOUT_TO_LEAVE,
          ENT_FEC_COL: null,
          ENT_FLW_ACC: action,
        }

        const table_values: TABLE_VALUES = {
          "D01": { // Distribución
            ENT_NUM,
            USU_LOG: "USR9509C",
            ENT_DI_FEC: getDateTime(),
            ENT_DI_PRO: origin,
            ENT_DI_GUI: null,    // (Distribución) - Plan de carga
            ENT_DI_PNC: null,    // (Distribución) - Peso Neto Calculado
            ENT_DI_CPA: 0,       // (Distribución) - Cantidad de Paletas | Se manda en 0 en la romana
            ENT_DI_PPA: null,    // (Distribución) - Peso de las paletas
            ENT_DI_PLA: null,    // (Distribución) - Plan de carga
            ENT_DI_DES: null,    // (Distribución) - Destino de carga
            ENT_DI_PAD: 0,       // (Distribución) - Peso adicional corregido | Se manda en 0 en la romana
            ENT_DI_DPA: null,    // (Distribución) - Algún tipo de descripción ❓
            ENT_DI_STA: null,    // (Distribución) - Status (1 | null)
            ENT_DI_AUT: null,
            ENT_DI_NDE: null,    // (Distribución) - Plan de carga
            ENT_DI_PAL: null,    // (Distribución) - Plan de carga con paletas (si colocan cantidad de paletas deja de ser null) | NULL
            ENT_DI_OBS: null,    // (Distribución) - Observaciones
            ENT_DI_REV: false,   // 1 | 0 (Aparentemente siempre es 0)
          },
          "D02": { // ✅ Materia Prima
            ENT_NUM,
            ENT_MP_PRO: origin,
            ENT_MP_FAC: (invoice) ? invoice : null,
            ENT_MP_NOT: null,     // SIEMPRE NULL
            ENT_MP_PAL: null      // SIEMPRE NULL
          },
          "D03": { // ✅ Servicios Generales
            ENT_NUM,
            ENT_SG_PRO: origin,
            ENT_SG_FAC: (invoice) ? invoice : null,
            ENT_SG_NOT: null,
            ENT_SG_AUT: null,
            ENT_SG_NDE: null
          },
          "D04": { // ✅ Almacén
            ENT_NUM,
            ENT_ALM_PRO: origin,
            ENT_ALM_FAC: (invoice) ? invoice : null,
          },
          "D05": { // ✅ Materiales
            ENT_NUM,
            ENT_PRO: origin,
            OPE_COD,
            MAT_COD: null       // Este codigo se pone en la salida pero aquí se manda en null
          },
          "D07": { // ✅ Otros Servicios
            ENT_NUM,
            ENT_OS_PRO: origin,
            ENT_OS_AUT: null    // Se coloca en la salida en el caso de existir
          },
        }

        const entryByDestination = table_values[DES_COD]

        console.log('entry', entry)
        console.log('entryByDestination', entryByDestination)

        // const data = await createNewEntry({ entry, entryByDestination })
        // console.log('data', data)

        handleAlert.open(({
          type: "success",
          title: "Entrada de Vehículo",
          message: `Se ha procesado la entrada del vehículo exitosamente"`,
        }))

      } else {
        handleAlert.open(({
          type: "warning",
          title: "Validación",
          message: `Para poder dar entrada al vehículo es necesario tener los datos tanto del "conductor" como del "vehículo"`,
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

      setDisableDriver(DES_COD === "D01")

      // Esto lo que hace es resetear los radio buttons
      const radios: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[type="radio"]')
      radios.forEach((input) => input.checked = false)
    }

    setNewEntry({
      ...newEntry,
      invoice,
      [target.id]: target.value,
    })
  }

  const { origin, invoice, destination, truckWeight, details } = newEntry
  const DES_COD = destination.slice(12, 15)

  return (
    <>
      <Modal className='py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_750px)]' {...{ showModal, setModal }}>
        <h1 className="font-semibold pb-10">Procesar Entrada de Vehículo</h1>
        <Form
          onSubmit={handleSubmit}
          className='grid grid-cols-2 gap-x-5 gap-y-8'
        >

          {/* Búsqueda por placa del vehículo */}
          <>
            <VehiculeEntranceSearch
              id="vehiculePlate"
              title="Placa del Vehículo"
              placeholder="A7371V"
              createButton="Crear Vehículo"
              handleCreateButton={handleCreateVehicule}
              searchInfo={searchVehicule}
            />
            {
              <span className="self-end pb-4 text-secondary">
                {
                  vehicule &&
                  <>{vehicule.plate} - {vehicule.model} - {vehicule.company}</>
                }
              </span>
            }
          </>

          {/* Búsqueda por cédula del conductor */}
          <>
            <VehiculeEntranceSearch
              id="driverID"
              title="Cédula del Chofer"
              placeholder="27313279"
              createButton="Crear Chofer"
              handleCreateButton={handleCreateDriver}
              disabled={disableDriver}
              searchInfo={searchDriver}
            />
            {
              <span className="self-end pb-4 text-secondary">
                {
                  driver &&
                  <>{driver.cedula} - {driver.name}</>
                }
              </span>
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

          <div className="pt-12 flex justify-center items-center gap-5">
            <label htmlFor="carga">
              <input
                id="carga"
                name="action"
                type="radio"
                className="mr-2"
                value="1"
                required
              />
              <span>Carga</span>
            </label>

            <label htmlFor="descarga">
              <input
                id="descarga"
                name="action"
                type="radio"
                className="mr-2"
                value="2"
                disabled={!(DES_COD === "D02" || DES_COD === "D03" || DES_COD === "D04" || DES_COD === "D07")}
                required
              />
              <span>Descarga</span>
            </label>

            <label htmlFor="devolucion">
              <input
                id="devolucion"
                name="action"
                type="radio"
                className="mr-2"
                value="3" disabled={!(DES_COD === "D01")}
                required
              />
              <span>Devolución</span>
            </label>
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

          <Button type="submit" className="bg-secondary col-span-2">Procesar</Button>
          
          <CreateVehiculeModal {...{showVehiculeModal, setVehiculeModal}}/>
          <CreateDriverModal {...{showDriverModal, setDriverModal}}/>
          
        </Form>
      </Modal>
      <NotificationModal alertProps={[alert, handleAlert]} />
    </>
  )
}

export default VehiculesEntrance