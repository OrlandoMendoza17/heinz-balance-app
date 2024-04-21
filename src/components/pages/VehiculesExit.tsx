import React, { ChangeEventHandler, Dispatch, FormEventHandler, MouseEventHandler, SetStateAction, lazy, useEffect, useRef, useState } from 'react'
import Select, { SelectOptions } from '../widgets/Select'
import Modal from '../widgets/Modal'
import Button from '../widgets/Button'
import Input from '../widgets/Input'
import { getCuteFullDate, getDateTime, shortDate } from '@/utils/parseDate'
import { ACTION, ACTION_BY_NAME, DESTINATION_BY_CODE, INVOICE_BY_CODE } from '@/lib/enums'
import useNotification from '@/hooks/useNotification'
import NotificationModal from '../widgets/NotificationModal'
import { createNewExit } from '@/services/exits'
import Form from '../widgets/Form'
import { getMaterials } from '@/services/materials'
import { getDensity } from '@/services/density'
import { createNewEntry, createNewEntryDifference, getDistEntries, getEntriesInPlant, getEntry, getFormattedDistEntries, updateDistEntry, updateEntry } from '@/services/entries'
import VehiculeExitDetails from './VehiculeExitDetails'
import { PDFRenderType } from '../widgets/PDFRender/types/PDFRendeType'
import ConfirmModal from '../widgets/ConfirmModal'
import readWeightFromBalance from '@/utils'
import useAuth from '@/hooks/useAuth'
import { getInsertExit, getUpdateValue } from '@/utils/getTableValues'

const PDFRender = lazy(() => import("../widgets/PDFRender"))

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  setExits: Dispatch<SetStateAction<Exit[]>>,
  exit: Exit
}

export type NewExit = P_SAL

type TABLE_VALUES = {
  D01: undefined,
  D02: P_ENT_MP,
  D03: P_ENT_SG,
  D04: P_ENT_ALM,
  D05: P_ENT_MAT,
  D07: P_ENT_OS,
}

type ChargeTypes = "KG" | "LTS"
type ChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>

const { CARGA, DESCARGA, TICKET_DE_SALIDA, DEVOLUCION } = ACTION

const VehiclesExit = ({ showModal, setModal, setExits, exit }: Props) => {

  const [, credentials] = useAuth()
  const { user } = credentials

  const [authCheck, setAuthCheck] = useState<boolean>(true)

  const [alert, handleAlert] = useNotification()
  const [confirm, handleConfirm] = useNotification()

  const [loading, setLoading] = useState<boolean>(false)

  const [disableWeight, setDisableWeight] = useState<boolean>(true)
  const [rendered, setRendered] = useState<boolean>(false)

  const [weightRead, setWeightRead] = useState<boolean>(false)
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
    exitDate: "",
    origin: "",
    truckWeight: 0,
    grossWeight: 0,
    calculatedNetWeight: 0,
    netWeight: 0,
    invoice: null,
    entryDetails: "",
    distDetails: "",
    exitDetails: "",
    palletWeight: 0,
    palletsQuatity: 0,
    aditionalWeight: 0,
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


  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const module = await import("../widgets/PDFRender")
  //       const PDF = module.default
  //       setImportedComponent(PDF)
  //     } catch (error) {
  //       console.log('error', error)
  //     }
  //   })()
  // }, [])

  const { palletWeight, palletsQuatity, aditionalWeight, invoice } = selectedExit
  const { entryNumber, vehicule, driver, entryDate, destination, origin, action } = selectedExit
  const { truckWeight, grossWeight, netWeight, calculatedNetWeight, exitDetails, entryDetails } = selectedExit

  const allPalletWeight = (palletWeight ? (palletWeight * palletsQuatity) : 0)

  const expectedWeight = calculatedNetWeight + allPalletWeight + aditionalWeight

  const handleOpenModal: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const exitMessage = "¿Estás seguro de que quieres darle salida al vehículo?"
    const returnMessage = '¿Estás seguro de que quieres devolver el vehículo a "Despacho"?'
    if (weightRead) {

      !isDifference ? handleSubmit : handleReturnVehicule

      handleConfirm.open({
        type: "warning",
        title: "Advertencia",
        message: !isDifference ? exitMessage : returnMessage
      })

    } else {
      handleAlert.open({
        type: "warning",
        title: "Peso no ingresado",
        message: "Debe leer el peso del vehículo para continuar con el proceso"
      })
    }
  }

  const handleSubmit = async () => {

    let validWeight = false;
    let invalidWeightMessage = "";
    debugger
    // El vehículo sale con más peso que con el que entró
    if (action === CARGA) {
      if (grossWeight >= truckWeight) {

        validWeight = true

      } else {
        invalidWeightMessage = "Si el vehículo vino a cargar, no es posible que salga con un peso menor al que entró"
      }
    }

    // El vehículo sale con más peso que con el que entró
    if (action !== CARGA) {
      if (grossWeight <= truckWeight) {

        validWeight = true

      } else {
        invalidWeightMessage = "Si el vehículo vino a (descargar, devolución o fue devuelto con ticket de salida), no es posible que salga con un peso mayor al que entró"
      }
    }

    // const validWeight = (action === CARGA) ? (grossWeight >= truckWeight) : (grossWeight <= truckWeight)

    if (!isDifference && validWeight) {

      try {
        setLoading(true)
        const form = new FormData(document.getElementsByTagName("form")[0])

        const material = form.get("materials") as string
        const density = parseFloat(form.get("density") as string)

        console.log('material', material)
        console.log('density', density)

        const { entryNumber: ENT_NUM, invoice, truckWeight, exitDetails, netWeight, destination, operation } = selectedExit

        // Si es Descarga o es Devoluación
        console.log('destination', destination)

        const densityLts = netWeight / density
        console.log('densityLts', densityLts)

        debugger

        // Si viene a cargar    -> el peso bruto tiene que ser mayor a la tara
        // Si viene a descargar -> el peso bruto tiene que ser menor a la tara

        const exitDate = getDateTime()

        const params = {
          user,
          ENT_NUM,
          DES_COD: destination,
          OPE_COD: operation,
          material,
          selectedExit,
          OS_AUTHORIZATION,
          authCheck,
          density,
          densityLts,
          exitDate,
        }

        // Creando objeto de Salida de vehículo
        const leavingEntry = getInsertExit(params)

        // Actualiza la entrada dependiendo del departamento
        const updateEntryByDestination = getUpdateValue(params)

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

        setSelectedExit(() => ({
          ...selectedExit, exitDate
        }))


        try {

          const { vehicule, driver } = selectedExit
          
          // const params = { 
          //   vehicule, 
          //   driver, 
          //   action, 
          //   ENT_NUM, 
          //   DES_COD: destination,
          //   OPE_COD: operation,
          //   user, 
          //   newEntry: {
          //     ...defaultNewEntry,
          //     details: selectedExit.details,
          //     truckWeight: selectedExit.truckWeight,
          //     invoice,: selectedExit.invoice 
          //     origin: selectedExit.origin,
          //   }
          // }
          
          // const entry = getInsertNewEntry(params)
          // const entryByDestination = getInsertValue(params) as object

          // console.log('entry', entry)
          // console.log('entryByDestination', entryByDestination)

          // await createNewEntry({ entry, entryByDestination })

        } catch (error) {
          console.log(error)
          setLoading(false)
          handleAlert.open(({
            type: "danger",
            title: "Error ❌",
            message: "Ha habido un error creando la entrada automática del vehículo",
          }))
        }

        setTimeout(() => {
          setRendered(true)

          setTimeout(() => {
            setRendered(false)
            setModal(false)
          }, 3000)
        }, 1000)

      } catch (error) {
        console.log(error)
        setLoading(false)
        handleAlert.open(({
          type: "danger",
          title: "Error ❌",
          message: "Ha habido un error procesando la salida del vehículo, intentelo de nuevo",
        }))
      }

    } else {

      const differenceMessage = "No es posible darle salida al vehículo si existe una diferencia"

      const message = isDifference ? differenceMessage : invalidWeightMessage

      handleAlert.open(({
        type: "warning",
        title: "Salida de Vehículo - Rechazada ❌",
        message,
      }))
    }
  }

  const handleReturnVehicule = async () => {
    try {
      setLoading(true)

      const distEntries = await getDistEntries("aboutToLeave")
      const distEntry = distEntries.find(({ ENT_NUM }) => selectedExit.entryNumber === ENT_NUM)

      if (distEntry) {

        const entry = await getEntry(selectedExit.entryNumber)
        const { ENT_NUM, ...rest } = entry

        const udpatedEntry: UpdateP_ENT = {
          ...rest,
          ENT_FLW: 1, // La asignación de este valor indica que lo SACA* de los vehículos "por salIr" y lo manda a "Distribución"
        }

        const updatedDistEntry = {
          ...distEntry,
          ENT_DI_REV: true, // Actualizando la entrada de distribución indicandole que lo devolvieron por una diferencia de peso.
        }

        const { entryNumber, grossWeight, weightDifference } = selectedExit

        const difDate = getDateTime()
        debugger
        const entryDif: Omit<P_ENT_DIF, "ENT_DIF_NUM"> = {
          ENT_NUM,                          // Numero de la entrada 
          ENT_DIF_FEC: difDate,             // Fecha en la que ocurre la diferencia 
          ENT_PES_TAR: truckWeight,         // Tara- peso de entrada 
          ENT_DI_PNC: distEntry.ENT_DI_PNC, // Peso del plan de carga
          ENT_DI_PAD: distEntry.ENT_DI_PAD, // Peso adicional 
          ENT_DI_PPA: distEntry.ENT_DI_PPA, // Peso de las paletas 
          SAL_PES_BRU: grossWeight,         // Peso bruto de la salida 
          DIF_PES: weightDifference,        // diferencia de peso 
          USU_LOG: user.accountName,              // Usuario que la registro
        }

        // Actualizando la entrada en ambas tablas y creando la entrada en la tabla de diferencias

        await updateEntry(entryNumber, udpatedEntry)
        await updateDistEntry(updatedDistEntry)
        await createNewEntryDifference(entryDif)

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

  const weightReading = (READ_WEIGHT: number) => {

    if (!Number.isNaN(READ_WEIGHT)) {

      setWeightRead(true)
      setIsDifference(false)

      const { action } = selectedExit

      let DIFFERENCE = 0
      // const READ_WEIGHT = 37302

      READ_WEIGHT = (READ_WEIGHT < 0) ? 0 : READ_WEIGHT

      const TOLERANCE = 150
      const CHARGED_TRUCK_WEIGHT = (truckWeight + expectedWeight)

      const MAXIMUM_TOLERABLE_WEIGHT = TOLERANCE + CHARGED_TRUCK_WEIGHT
      const MINIMUM_TOLERABLE_WEIGHT = CHARGED_TRUCK_WEIGHT - TOLERANCE

      debugger
      if (
        destination === "D01" &&
        action !== DEVOLUCION &&
        action !== TICKET_DE_SALIDA &&
        (READ_WEIGHT < MINIMUM_TOLERABLE_WEIGHT || READ_WEIGHT > MAXIMUM_TOLERABLE_WEIGHT)
      ) {

        setIsDifference(true)

        DIFFERENCE = READ_WEIGHT - CHARGED_TRUCK_WEIGHT

        handleAlert.open(({
          type: "warning",
          title: "Diferencia de Peso",
          message: `Se ha detectado una diferencia con respecto al peso neto calculado de ${DIFFERENCE} KG"`,
        }))
      }

      let netWeight = 0;

      // El vehículo sale con más peso que con el que entró
      if ((action === CARGA) && (READ_WEIGHT >= truckWeight)) {
        netWeight = READ_WEIGHT - truckWeight
      }

      // El vehículo sale con más peso que con el que entró
      if ((action !== CARGA) && (READ_WEIGHT <= truckWeight)) {
        netWeight = truckWeight - READ_WEIGHT
      }

      setSelectedExit({
        ...selectedExit,
        weightDifference: DIFFERENCE,
        grossWeight: READ_WEIGHT,
        netWeight,
      })

    } else {
      setSelectedExit({
        ...selectedExit,
        grossWeight: READ_WEIGHT,
      })
    }
  }

  const handleWeightReading: MouseEventHandler<HTMLButtonElement> = async () => {
    try {

      const truckWeight = await readWeightFromBalance()

      if (truckWeight === undefined) {
        throw Error("La lectura del peso es undefined")
      }

      weightReading(truckWeight ? truckWeight : 0)

    } catch (error) {
      console.log('error', error)
      handleAlert.open(({
        type: "warning",
        title: "Lectura de peso",
        message: "Hay un problema leyendo el peso de la balanza, intentelo de nuevo",
      }))
    }
  }

  console.log('entryDate', entryDate)
  console.log('entryDate', getCuteFullDate(entryDate))

  // console.log('exitDate', getDateTime())
  // console.log('exitDate', getCuteFullDate(getDateTime()))

  // console.log('exitDate', getCuteFullDate("2024-04-08T17:32:59.805Z"))

  const REQUIRES_INVOICE = Boolean(INVOICE_BY_CODE[destination])

  return (
    <>
      <Modal
        {...{ showModal, setModal }}
        className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_750px)]"
      >
        <h1 className="font-semibold pb-10">Procesar Salida de Vehículo</h1>
        <Form
          className='grid gap-x-5 gap-y-8'
          onSubmit={handleOpenModal}
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
            {
              destination === "D01" &&
              action !== DEVOLUCION &&
              action !== TICKET_DE_SALIDA &&
              <li className={`${isDifference ? "bg-yellow-300" : "bg-emerald-300"} p-2`}>
                <span className="font-bold block">Peso Estimado de Carga:</span>
                {expectedWeight}
              </li>
            }
            <li className="bg-sky-100 p-2">
              <span className="font-bold block">Detalles de entrada:</span>
              {entryDetails}
            </li>
          </ul>

          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-end gap-4">
            <div className="grid gap-[7px] self-end items-center">
              <span className="font-semibold block">Peso Tara (Entrada):</span>
              <span className="h-[41px] flex items-center border px-5">{truckWeight}</span>
            </div>
            <span className="pb-3 text-lg">
              {action === CARGA ? "+" : "-"}
            </span>

            <div className="grid gap-[7px] self-end items-center">
              <span className="font-semibold block">Peso Neto ({ACTION_BY_NAME[action as Action]}):</span>
              <span className={`h-[41px] flex items-center border px-5 ${isDifference ? "!bg-red-500 !text-white !border-red-800" : ""}`}>
                {netWeight}
              </span>
            </div>

            <span className="pb-3 text-lg">=</span>

            <div className="grid grid-cols-[17rem_6rem] items-end mt-5 relative">
              <Input
                id="grossWeight"
                value={grossWeight}
                type='number'
                className={`!rounded-r-none font-semibold`}
                title="Peso Bruto (Salida):"
                placeholder="0.00"
                disabled={disableWeight}
                onChange={({ currentTarget }) => {
                  weightReading(parseFloat(currentTarget.value))
                }}
              />
              <Button
                onClick={handleWeightReading}
                className={`bg-secondary !rounded-l-none h-[41px] `}
              >
                Leer
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
          </div>

          <div className="">
            {
              // Materia Prima
              destination === "D02" &&
              <div className="flex gap-10 py-5">
                <div>
                  <span className="font-semibold">Tipo de Carga:</span>
                  <div className="flex gap-4 pt-4">
                    <label htmlFor="kilos" className="flex gap-2">
                      <input type="radio" name="chargeType" onChange={handleChange} id="kilos" value="KG" required />
                      <span>kilos</span>
                    </label>
                    <label htmlFor="litros" className="flex gap-2">
                      <input type="radio" name="chargeType" onChange={handleChange} id="litros" value="LTS" required />
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
            {
              (REQUIRES_INVOICE && action === ACTION.DESCARGA) &&
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
          </div>

          <VehiculeExitDetails
            exit={selectedExit}
            exitDetails={exitDetails}
            densityOptions={density}
            materialsOptions={materials}
            OS_AUTHORIZATION={OS_AUTHORIZATION}
            handleAlert={handleAlert}
            handleChange={handleChange}
            setSelectedExit={setSelectedExit}
          />

          <label htmlFor="automically-entry" className="flex justify-self-end self-center gap-4 cursor-pointer">
            <input type="checkbox" name="" id="automically-entry" />
            <span className="block select-none">Crear entrada automáticamente</span>
          </label>

          {
            rendered &&
            <PDFRender exit={selectedExit} />
          }

          <Button type="submit" loading={loading} className="bg-secondary">
            {!isDifference ? "Procesar" : "Devolver a Distribución"}
          </Button>

        </Form>
      </Modal>
      <NotificationModal alertProps={[alert, handleAlert]} />
      <ConfirmModal
        acceptAction={!isDifference ? handleSubmit : handleReturnVehicule}
        confirmProps={[confirm, handleConfirm]}
      />

    </>
  )
}

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export default VehiclesExit
