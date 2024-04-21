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
import { createNewEntry, getEntriesInPlant, getNextEntryNumber } from '@/services/entries'
import { format } from 'date-fns'
import { getDateTime } from '@/utils/parseDate'
import { DESTINATIONS } from '@/pages/api/destinations'
import CreateVehiculeModal from './CreateVehiculeModal'
import CreateDriverModal from './CreateDriverModal'
import ConfirmModal from '../widgets/ConfirmModal'
import defaultNewEntry from '@/utils/defaultValues/newEntry'
import readWeightFromBalance from "@/utils/index"
import useAuth from '@/hooks/useAuth'
import CheckAction from './CheckAction'
import { getInsertNewEntry, getInsertValue } from '@/utils/getTableValues'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  refreshEntries: () => Promise<void>,
}

type DestinationSelectValue = { DES_COD: DES_COD, OPE_COD: string }
export type ChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>

type TABLE_VALUES = {
  D01: P_ENT_DI,
  D02: P_ENT_MP,
  D03: P_ENT_SG,
  D04: P_ENT_ALM,
  D05: P_ENT_MAT,
  D07: P_ENT_OS,
}

const { CARGA, DESCARGA, DEVOLUCION } = ACTION

const VehiculesEntrance = ({ showModal, setModal, refreshEntries }: Props) => {

  const [, credentials] = useAuth()
  const { user } = credentials

  const [alert, handleAlert] = useNotification()
  const [confirm, handleConfirm] = useNotification()

  const [loading, setLoading] = useState<boolean>(false)

  const [showVehiculeModal, setVehiculeModal] = useState<boolean>(false)
  const [showDriverModal, setDriverModal] = useState<boolean>(false)

  const [disableWeight, setDisableWeight] = useState<boolean>(true)
  const [enableInvoice, setEnableInvoice] = useState<boolean>(false)

  const [destinations, setDestinations] = useState<SelectOptions[]>([])

  const [driver, setDriver] = useState<Driver>()
  const [vehicule, setVehicule] = useState<Vehicule>()

  const [action, setAction] = useState<Action>()
  
  const [newEntry, setNewEntry] = useState<NewEntryDto>(defaultNewEntry)

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
  }, [showModal])

  const search = {
    vehicule: async (vehiculePlate: string) => {

      // Antes de la busqueda se vuelve undefined para borrar los datos almacenados en el estado
      setVehicule(undefined)
      setDriver(undefined)

      const vehicule = await getVehicule(vehiculePlate)
      setVehicule(vehicule)

      const driver = await getDriverFromVehicule(vehicule.id)
      setDriver(driver)
    },
    driver: async (driverID: string) => {

      // Antes de la busqueda se vuelve undefined para borrar los datos almacenados en el estado
      setDriver(undefined)

      const driver = await getDriver(driverID, "CON_CED")
      setDriver(driver)
    },
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const form = new FormData(document.getElementsByTagName("form")[0])
      debugger
      const { truckWeight, details, origin, invoice } = newEntry; // Destiny code

      const { DES_COD, OPE_COD }: DestinationSelectValue = JSON.parse(form.get("destination") as string)

      let exits = await getEntriesInPlant()
      // exits = exits.filter(({ aboutToLeave }) => aboutToLeave)

      if (truckWeight) {

        if (vehicule && driver) {

          const vehiculeInPlantYet = exits.find(({ vehicule: { plate } }) => vehicule?.plate === plate)

          if (vehiculeInPlantYet?.vehicule.plate !== vehicule?.plate) {

            const { nextEntryNumber: ENT_NUM } = await getNextEntryNumber()

            const params = { 
              vehicule, 
              driver, 
              action, 
              ENT_NUM, 
              DES_COD, 
              OPE_COD, 
              user, 
              newEntry 
            }
            
            const entry = getInsertNewEntry(params)
            const entryByDestination = getInsertValue(params) as object

            console.log('entry', entry)
            console.log('entryByDestination', entryByDestination)

            await createNewEntry({ entry, entryByDestination })

            handleAlert.open(({
              type: "success",
              title: "Entrada de Vehículo",
              message: `Se ha procesado la entrada del vehículo exitosamente"`,
            }))

            await refreshEntries()

            // Resets the modal
            setVehicule(undefined)
            setDriver(undefined)
            setEnableInvoice(false)
            setNewEntry(defaultNewEntry)
            setDisableWeight(true)

            setLoading(false)
            setModal(false)

          } else {

            handleAlert.open(({
              type: "danger",
              title: "Vehículo en planta",
              message: `No es posible darle entrada a un vehículo que se encuentra actualmente en planta`,
            }))

            setLoading(false)
          }

        } else {

          handleAlert.open(({
            type: "warning",
            title: "Validación",
            message: `Para poder dar entrada al vehículo es necesario tener los datos tanto del "conductor" como del "vehículo"`,
          }))

          setLoading(false)
        }

      } else {
        handleAlert.open(({
          type: "warning",
          title: "Peso en 0",
          message: `Para poder dar entrada al vehículo es necesario leer el peso del vehículo"`,
        }))

        setLoading(false)
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

    const { name, value } = target

    let actionInput = action
    
    if (target.name === "action") {
      actionInput = parseInt(target.value) as Action
      setAction(actionInput)
    }
    
    let invoice = newEntry.invoice

    const destinationSelect = document.getElementById("destination") as HTMLSelectElement
    const { DES_COD }: DESTINATION_VALUES = JSON.parse(destinationSelect.value)

    const REQUIRES_INVOICE = Boolean(INVOICE_BY_CODE[DES_COD])
    setEnableInvoice(REQUIRES_INVOICE && actionInput === ACTION.DESCARGA)
    
    invoice = REQUIRES_INVOICE ? newEntry.invoice : null

    if (target.name === "destination") {
      setDriver(DES_COD === "D01" ? undefined : driver)

      // Esto lo que hace es resetear los radio buttons
      setAction(undefined)
    }

    setNewEntry({
      ...newEntry,
      invoice,
      [name]: name === "truckWeight" ? parseInt(value) : value.toUpperCase(),
    })
  }

  const handleWeightReading = async () => {
    try {

      const truckWeight = await readWeightFromBalance()

      if (truckWeight === undefined) {
        throw Error("La lectura del peso es undefined")
      }

      setNewEntry({
        ...newEntry,
        truckWeight: truckWeight ? truckWeight : 0,
      })

    } catch (error) {
      handleAlert.open(({
        type: "warning",
        title: "Lectura de peso",
        message: "Hay un problema leyendo el peso de la balanza, intentelo de nuevo",
      }))
    }
  }

  const handleOpenModal: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    handleConfirm.open({
      type: "warning",
      title: "Advertencia",
      message: `¿Estás seguro de que quieres darle entrada al vehículo?`
    })
  }

  const { origin, invoice, destination, truckWeight, details } = newEntry
  debugger
  const DES_COD = destination.slice(12, 15)

  console.log('DES_COD', DES_COD)
  console.log('destination', destination)
  const disableDriver = (DES_COD === "D01")
  console.log('disableDriver', disableDriver)

  return (
    <>
      <Modal
        {...{ showModal, setModal, closeOnClickOutside: false }}
        className='py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_750px)]'
      >
        <h1 className="font-semibold pb-10">Procesar Entrada de Vehículo</h1>
        <Form
          onSubmit={handleOpenModal}
          className='grid grid-cols-2 gap-x-5 gap-y-8'
        >

          {/* Búsqueda por placa del vehículo */}
          <>
            <VehiculeEntranceSearch
              id="vehiculePlate"
              title="Placa del Vehículo"
              placeholder="A7371V"
              createButton="Crear Vehículo"
              handleCreateButton={() => setVehiculeModal(true)}
              searchInfo={search.vehicule}
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
              handleCreateButton={() => setDriverModal(true)}
              disabled={disableDriver}
              searchInfo={search.driver}
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
            defaultValue={DES_COD}
            name="destination"
            title="Destino"
            defaultOption="Destino"
            options={destinations}
            onChange={handleChange}
            objectString
          />

          <div className="grid grid-cols-[1fr_auto] items-end relative">
            <Input
              id="truckWeight"
              value={truckWeight}
              type='number'
              className="w-full !rounded-r-none"
              title="Peso Tara (kg)"
              placeholder="0.00"
              min={1}
              disabled={disableWeight}
              onChange={handleChange}
            />
            <Button
              onClick={handleWeightReading}
              style={{ maxHeight: "41px" }}
              className='bg-secondary !rounded-l-none'
            >
              Leer Peso
            </Button>
            {
              (user.rol === "01" || user.rol === "02") &&
              <button
                type="button"
                onClick={() => setDisableWeight(!disableWeight)}
                className={`create-btn ${!disableWeight ? "!bg-red-400 !text-black font-bold" : ""}`}
              >
                Habilitar Peso
              </button>
            }
          </div>

          <CheckAction {...{ handleChange, DES_COD, action }} />

          {
            enableInvoice &&
            <Input
              id="invoice"
              value={invoice || ""}
              className="w-full"
              title="Factura"
              placeholder=""
              onChange={handleChange}
              required={false}
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

          <Button
            type="submit"
            loading={loading}
            className="bg-secondary col-span-2"
          >
            Procesar
          </Button>

        </Form>

        {
          showVehiculeModal &&
          <CreateVehiculeModal {...{ showVehiculeModal, setVehiculeModal }} />
        }
        {
          showDriverModal &&
          <CreateDriverModal {...{ showDriverModal, setDriverModal }} />
        }
      </Modal>
      <NotificationModal alertProps={[alert, handleAlert]} />
      <ConfirmModal
        acceptAction={handleSubmit}
        confirmProps={[confirm, handleConfirm]}
      />
    </>
  )
}

export default VehiculesEntrance