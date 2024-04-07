import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useRef, useState } from 'react'
import Select, { SelectOptions } from '../widgets/Select'
import { getDestination } from '@/services/destination'
import Modal from '../widgets/Modal'
import Button from '../widgets/Button'
import Input from '../widgets/Input'
import Textarea from '../widgets/Textarea'
import { getCuteFullDate, getDateTime, shortDate } from '@/utils/parseDate'
import { ACTION, DESTINATION_BY_CODE } from '@/lib/enums'
import useNotification from '@/hooks/useNotification'
import NotificationModal from '../widgets/NotificationModal'
import { createNewExit } from '@/services/exits'
import { format } from 'date-fns'
import Form from '../widgets/Form'
import { getMaterials } from '@/services/materials'
import { getDensity } from '@/services/density'
import { createNewEntryDifference, getDistEntries, getEntriesInPlant, getEntry, getFormattedDistEntries, updateDistEntry, updateEntry } from '@/services/entries'
import VehiculeExitDetails from './VehiculeExitDetails'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  setExits: Dispatch<SetStateAction<Exit[]>>,
  exit: Exit
}

export type NewExit = P_SAL

type TABLE_VALUES = {
  D01: undefined,
  D02: undefined,
  D03: undefined,
  D04: undefined,
  D05: P_ENT_MAT,
  D07: P_ENT_OS,
}

type ChargeTypes = "KG" | "LTS"
type ChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>

const { CARGA } = ACTION

const VehiclesExit = ({ showModal, setModal, setExits, exit }: Props) => {

  const [authCheck, setAuthCheck] = useState<boolean>(true)

  const [alert, handleAlert] = useNotification()
  const [loading, setLoading] = useState<boolean>(false)


  const [isDifference, setIsDifference] = useState<boolean>(false)

  const [OS_AUTHORIZATION, setOS_AUTHORIZATION] = useState<string>("")

  const [density, setDensity] = useState<SelectOptions[]>([])
  const [materials, setMaterials] = useState<SelectOptions[]>([])

  const [selectedExit, setSelectedExit] = useState<Exit>({
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
    action: 1,
    destination: "D01",
    operation: "",
    entryDate: "",
    origin: "",
    truckWeight: 0,
    grossWeight: 0,
    calculatedNetWeight: 0,
    netWeight: 0,
    invoice: null,
    details: "",
    weightDifference: 0,
    aboutToLeave: false,
  })

  const [chargeType, setChargeType] = useState<ChargeTypes>("KG")

  useEffect(() => {
    (async () => {
      setSelectedExit(exit)
      try {

        const density = await getDensity()
        const materials = await getMaterials()

        const densityOptions: SelectOptions[] = density.map(({ DEN_DES, DEN_DEN }) => {
          return {
            name: `${DEN_DES} - ${DEN_DEN}`,
            value: DEN_DEN,
          }
        })

        const materialsOptions: SelectOptions[] = materials.map(({ MAT_DES, MAT_COD }) => {
          return {
            name: MAT_DES,
            value: MAT_COD,
          }
        })

        setDensity(densityOptions)
        setMaterials(materialsOptions)

      } catch (error) {
        console.log(error)
        handleAlert.open(({
          type: "danger",
          title: "Error ❌",
          message: "Ha habido un error trayendose la información de la densidad y los materiales, por favor inténtelo de nuevo",
        }))
        setModal(false)
      }
    })()
  }, [exit])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (isDifference) {

      try {
        setLoading(true)
        const form = new FormData(event.currentTarget)

        const material = form.get("materials")
        const density = parseFloat(form.get("density") as string)

        console.log('material', material)
        console.log('density', density)
        const { entryNumber: ENT_NUM, invoice, truckWeight, details, destination, operation } = selectedExit

        // Si es Descarga o es Devoluación
        console.log('destination', destination)
        const netWeight = Math.abs(grossWeight - truckWeight)

        const densityLts = netWeight / density
        console.log('densityLts', densityLts)

        debugger

        // Si viene a cargar    -> el peso bruto tiene que ser mayor a la tara
        // Si viene a descargar -> el peso bruto tiene que ser menor a la tara

        const leavingEntry: NewExit = {
          ENT_NUM,
          USU_LOG: 'USR9509C',
          SAL_FEC: getDateTime(),
          ENT_PES_TAR: truckWeight,
          ENT_PES_NET: netWeight,
          SAL_PES_BRU: grossWeight,
          DEN_COD: null,        // Siempre es NULL
          SAL_DEN_LIT: density ? densityLts : null,
          SAL_OBS: (details !== "") ? details : null,
        }

        const table_values: TABLE_VALUES = {
          "D01": undefined, // Distribución
          "D02": undefined, // Materia Prima
          "D03": undefined, // Servicios Generales
          "D04": undefined, // Almacén
          "D05": {          // Materiales
            ENT_NUM,
            ENT_PRO: origin,
            OPE_COD: operation,
            MAT_COD: material as string,       // Este codigo se pone en la salida pero aquí se manda en null
          },
          "D07": {          // Otros Servicios
            ENT_NUM,
            ENT_OS_PRO: origin,
            ENT_OS_AUT: !authCheck ? (OS_AUTHORIZATION || null) : null
          },
        }

        // Dependiendo si es undefined o si trae un valor es porque sí se actualiza o no
        const updateEntryByDestination = table_values[destination]

        console.log('leavingEntry', leavingEntry)
        console.log('updateEntryByDestination', updateEntryByDestination)

        await createNewExit({ leavingEntry, updateEntryByDestination, destination })

        // Saca al vehículo de las entradas por salir que está en el cliente
        setExits((exits) => exits.filter((item) => item.entryNumber !== entryNumber))

        handleAlert.open(({
          type: "success",
          title: "Salida de Vehículo",
          message: `Se ha procesado la salida del vehículo exitosamente"`,
        }))

        setTimeout(() => setModal(false), 3000)

      } catch (error) {
        console.log(error)
        setLoading(false)
        handleAlert.open(({
          type: "danger",
          title: "Error ❌",
          message: "Ha habido un error procesando la entrada del vehículo, intentelo de nuevo",
        }))
      }

    } else {
      handleAlert.open(({
        type: "warning",
        title: "Salida de Vehículo - Rechazada ❌",
        message: `No es posible darle salida al vehpiculo si existe una diferencia"`,
      }))
    }
  }

  const handleReturnVehicule: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)

      const distEntries = await getDistEntries("aboutToLeave")
      const distEntry = distEntries.find(({ ENT_NUM }) => selectedExit.entryNumber === ENT_NUM)

      if (distEntry) {

        const updatedDistEntry = {
          ...distEntry,
          ENT_DI_REV: true, // Actualizando la entrada de distribución indicandole que lo devolvieron por una diferencia de peso.
        }

        const { entryNumber, grossWeight, weightDifference } = selectedExit

        const entry = await getEntry(selectedExit.entryNumber)
        const { ENT_NUM, ...rest } = entry

        const entryDif: Omit<P_ENT_DIF, "ENT_DIF_NUM"> = {
          ENT_NUM,                          // Numero de la entrada 
          ENT_DIF_FEC: getDateTime(),       // Fecha en la que ocurre la diferencia 
          ENT_PES_TAR: truckWeight,         // Tara- peso de entrada 
          ENT_DI_PNC: distEntry.ENT_DI_PNC, // Peso del plan de carga
          ENT_DI_PAD: distEntry.ENT_DI_PAD, // Peso adicional 
          ENT_DI_PPA: distEntry.ENT_DI_PPA, // Peso de las paletas 
          SAL_PES_BRU: grossWeight,         // Peso bruto de la salida 
          DIF_PES: weightDifference,        // diferencia de peso 
          USU_LOG: "USR9509C",              // Usuario que la registro
        }

        const udpatedEntry: UpdateP_ENT = {
          ...rest,
          ENT_FLW: 1, // La asignación de este valor indica que lo SACA* de los vehículos "por salIr" y lo manda a "Distribución"
        }

        // Actualizando la entrada en ambas tablas y creando la entrada en la tabla de diferencias
        
        // await updateEntry(entryNumber, udpatedEntry)
        // await updateDistEntry(updatedDistEntry)
        // await createNewEntryDifference(entryDif)

        // Saca al vehículo de las entradas por salir que está en el cliente
        setExits((exits) => exits.filter((item) => item.entryNumber !== entryNumber))
        
        handleAlert.open(({
          type: "success",
          title: "Devolución a Distribución",
          message: `Se ha devuelto el camión al distribición exitosamente"`,
        }))

        setTimeout(() => setModal(false), 3000)
      }

    } catch (error) {
      setLoading(false)
      console.log('error', error)
      handleAlert.open(({
        type: "danger",
        title: "Error ❌",
        message: "Ha habido un error procesando la devolución del vehículo a distribución, intentelo de nuevo",
      }))
    }
  }

  const handleChange: ChangeHandler = async (event) => {
    const target = event.target
    type DESTINATION_VALUES = { DES_COD: DES_COD, OPE_COD: string }
    if (target.name === "chargeType") {

      setChargeType(target.value as ChargeTypes)

    } else if (target.name === "authorization") {

      setOS_AUTHORIZATION(target.value)

    } if (target.name === "auth-check") {

      const currentTarget = event.currentTarget as HTMLInputElement
      setAuthCheck(currentTarget.checked)

    } else {
      setSelectedExit({
        ...selectedExit,
        [target.id]: target.value,
      })
    }

  }

  const handleWeightReading = () => {

    setIsDifference(false)

    let DIFFERENCE = 0
    const READ_WEIGHT = 37302

    const TOLERANCE = 150
    const CHARGED_TRUCK_WEIGHT = (truckWeight + calculatedNetWeight)

    const MAXIMUM_TOLERABLE_WEIGHT = TOLERANCE + CHARGED_TRUCK_WEIGHT
    const MINIMUM_TOLERABLE_WEIGHT = CHARGED_TRUCK_WEIGHT - TOLERANCE

    if (READ_WEIGHT < MINIMUM_TOLERABLE_WEIGHT || READ_WEIGHT > MAXIMUM_TOLERABLE_WEIGHT) {

      setIsDifference(true)

      DIFFERENCE = READ_WEIGHT - CHARGED_TRUCK_WEIGHT

      handleAlert.open(({
        type: "warning",
        title: "Diferencia de Peso",
        message: `Se ha detectado una diferencia con respecto al peso neto calculado de ${DIFFERENCE} KG"`,
      }))
    }

    setSelectedExit({
      ...selectedExit,
      weightDifference: DIFFERENCE,
      grossWeight: READ_WEIGHT,
    })
  }

  const { entryNumber, vehicule, driver, entryDate, destination, origin, details, truckWeight, grossWeight, calculatedNetWeight, action } = selectedExit

  return (
    <>
      <Modal className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_750px)]" {...{ showModal, setModal }}>
        <h1 className="font-semibold pb-10">Procesar Salida de Vehículo</h1>
        <Form
          className='grid gap-x-5 gap-y-8'
          onSubmit={!isDifference ? handleSubmit : handleReturnVehicule}
        >

          <ul className="grid grid-cols-3 gap-5">
            <li className="bg-sky-100 p-2">
              <span className="font-bold block">Número de Entrada:</span>
              {entryNumber}
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-bold block">Cédula del Chofer:</span>
              {driver.cedula}
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-bold block">Placa del Vehículo:</span>
              {vehicule.plate}
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-bold block">Fecha de Entrada:</span>
              {getCuteFullDate(entryDate)}
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-bold block">Fecha de Salida:</span>
              {getCuteFullDate(getDateTime())}
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-bold block">Procedencia:</span>
              {origin}
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-bold block">Destino:</span>
              {DESTINATION_BY_CODE[destination]}
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-bold block">Peso Neto Calculado:</span>
              {calculatedNetWeight}
            </li>
          </ul>

          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-end gap-4">
            <div className="grid gap-[7px] self-end items-center">
              <span className="font-semibold block">Peso Tara:</span>
              <span className="h-[41px] flex items-center border px-5">{truckWeight}</span>
            </div>
            <span className="pb-3 text-lg">
              {action === CARGA ? "+" : "-"}
            </span>
            <div className="grid gap-[7px] self-end items-center">
              <span className="font-semibold block">Peso Neto:</span>
              <span className={`h-[41px] flex items-center border px-5 ${isDifference ? "!bg-red-500 !text-white !border-red-800" : ""}`}>{Math.abs(grossWeight - truckWeight)}</span>
            </div>
            <span className="pb-3 text-lg">=</span>
            <div className="grid grid-cols-[17rem_6rem] items-end mt-5">
              <Input
                id="grossWeight"
                value={grossWeight}
                type='number'
                className={`!rounded-r-none font-semibold`}
                title="Peso Bruto:"
                placeholder="0.00"
                disabled={true}
                onChange={handleChange}
              />
              <Button
                onClick={handleWeightReading}
                className={`bg-secondary !rounded-l-none h-[41px] `}
              >
                Leer
              </Button>
            </div>
          </div>

          {
            // Materia Prima
            destination === "D02" &&
            <div className="flex gap-10 py-5">
              <div>
                <span className="font-semibold">Tipo de Carga:</span>
                <div className="flex gap-4 pt-4">
                  <label htmlFor="kilos" className="flex gap-2">
                    <input type="radio" name="chargeType" onChange={handleChange} id="kilos" value="KG" />
                    <span>kilos</span>
                  </label>
                  <label htmlFor="litros" className="flex gap-2">
                    <input type="radio" name="chargeType" onChange={handleChange} id="litros" value="LTS" />
                    <span>Litros</span>
                  </label>
                </div>
              </div>
              {
                chargeType === "LTS" &&
                <Select
                  name="density"
                  title="Densidad:"
                  className="font-semibold"
                  defaultOption=""
                  options={density}
                  onChange={() => { }}
                />
              }
            </div>
          }
          {
            // Materiales
            destination === "D05" &&
            <Select
              name="materials"
              title="Tipo de Material"
              defaultOption="Material"
              options={materials}
              onChange={() => { }}
            />
          }
          {
            // Otros Servicios
            destination === "D07" &&
            <div>
              <div className="flex gap-4 justify-start pb-4">
                <input type="checkbox" name="auth-check" id="auth-check" checked={authCheck} onChange={handleChange} />
                <label htmlFor="auth-check" className="cursor-pointer">Sin autorización de salida</label>
              </div>
              <Input
                id="authorization"
                value={OS_AUTHORIZATION}
                type="text"
                className="w-full !rounded-r-none"
                disabled={authCheck}
                onChange={handleChange}
              />
            </div>
          }

          <VehiculeExitDetails
            exit={exit}
            details={details}
            densityOptions={density}
            materialsOptions={materials}
            OS_AUTHORIZATION={OS_AUTHORIZATION}
            handleAlert={handleAlert}
            handleChange={handleChange}
            setSelectedExit={setSelectedExit}
          />

          <Button type="submit" loading={loading} className="bg-secondary">
            {!isDifference ? "Procesar" : "Devolver a Distribución"}
          </Button>

        </Form>
      </Modal>
      <NotificationModal alertProps={[alert, handleAlert]} />
    </>
  )
}

export default VehiclesExit
