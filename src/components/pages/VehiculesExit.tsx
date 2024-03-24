import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useRef, useState } from 'react'
import Select, { SelectOptions } from '../widgets/Select'
import { getDestination } from '@/services/destination'
import Modal from '../widgets/Modal'
import Button from '../widgets/Button'
import Input from '../widgets/Input'
import Textarea from '../widgets/Textarea'
import { getCuteFullDate, getDateTime, shortDate } from '@/utils/parseDate'
import { DESTINATION_BY_CODE } from '@/lib/enums'
import useNotification from '@/hooks/useNotification'
import NotificationModal from '../widgets/NotificationModal'
import { createNewExit } from '@/services/exits'
import { format } from 'date-fns'
import Form from '../widgets/Form'
import { getMaterials } from '@/services/materials'
import { getDensity } from '@/services/density'
import { getDistEntries, getFormattedDistEntries } from '@/services/entries'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  entry: Entry
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

const VehiclesExit = ({ showModal, setModal, entry }: Props) => {

  const $authCheck = useRef<HTMLInputElement>(null)

  const [alert, handleAlert] = useNotification()

  const [OS_AUTHORIZATION, setOS_AUTHORIZATION] = useState<string>("")

  const [density, setDensity] = useState<SelectOptions[]>([])
  const [materials, setMaterials] = useState<SelectOptions[]>([])

  const [selectedEntry, setSelectedEntry] = useState<Entry>({
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
    destination: "D01",
    operation: "",
    entryDate: "",
    origin: "",
    truckWeight: 0,
    grossWeight: 0,
    netWeight: 0,
    invoice: null,
    details: "",
    aboutToLeave: false,
  })

  const [chargeType, setChargeType] = useState<ChargeTypes>("KG")

  useEffect(() => {
    (async () => {
      try {

        const entries = await getFormattedDistEntries("aboutToLeave")
        const distEntry = entries.find(({ entryNumber }) => entry.entryNumber === entryNumber)

        if (distEntry) {
          const { chargePlan, calculatedNetWeight, chargeDestination } = distEntry

          const details = `PLAN DE CARGA: ${chargePlan}\nPESO DE CARGA: ${calculatedNetWeight}\nDESTINO DE CARGA: ${chargeDestination}`

          setSelectedEntry({ ...selectedEntry, details })
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])


  useEffect(() => {
    (async () => {
      setSelectedEntry(entry)
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
  }, [entry])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {

      const form = new FormData(event.currentTarget)

      const material = form.get("materials")
      const density = parseInt(form.get("density") as string)

      console.log('material', material)
      const { entryNumber: ENT_NUM, invoice, truckWeight, details, destination, operation } = selectedEntry

      // Si es Descarga o es Devoluación

      const netWeight = Math.abs(grossWeight - truckWeight)

      const leavingEntry: NewExit = {
        ENT_NUM: '95505',
        USU_LOG: 'USR9509C',
        SAL_FEC: getDateTime(),
        ENT_PES_TAR: truckWeight,
        ENT_PES_NET: Math.abs(grossWeight - truckWeight),
        SAL_PES_BRU: grossWeight,
        DEN_COD: null,        // Siempre es NULL
        SAL_DEN_LIT: density ? netWeight / density : null,
        SAL_OBS: (details === "") ? details : null,
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
          ENT_OS_AUT: $authCheck.current?.checked ? (OS_AUTHORIZATION || null) : null
        },
      }

      // Dependiendo si es undefined o si trae un valor es porque sí se actualiza o no
      const updateEntryByDestination = table_values[destination]

      console.log('leavingEntry', leavingEntry)
      console.log('updateEntryByDestination', updateEntryByDestination)

      // await createNewExit({ leavingEntry, updateEntryByDestination })

      handleAlert.open(({
        type: "success",
        title: "Salida de Vehículo",
        message: `Se ha procesado la salida del vehículo exitosamente"`,
      }))

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
    if (target.name === "chargeType") {

      setChargeType(target.value as ChargeTypes)

    } else if (target.name === "authorization") {

      setOS_AUTHORIZATION(target.value)

    } else {
      setSelectedEntry({
        ...selectedEntry,
        [target.id]: target.value,
      })
    }

  }

  // console.log("HOY", getDateTime())
  // console.log("Otra Fecha", getDateTime("2024-11-02 00:19"))

  const { entryNumber, vehicule, driver, entryDate, destination, origin, details, truckWeight, grossWeight, netWeight } = selectedEntry

  return (
    <>
      <Modal className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_750px)]" {...{ showModal, setModal }}>
        <h1 className="font-semibold pb-10">Procesar Salida de Vehículo</h1>
        <Form onSubmit={handleSubmit} className='grid gap-x-5 gap-y-8'>

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
          </ul>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-[7px] self-end items-center">
              <span className="font-semibold block">Peso Tara:</span>
              <span className="h-[41px] flex items-center border px-5">{truckWeight}</span>
            </div>
            <div className="grid grid-cols-[17rem_6rem] items-end mt-5">
              <Input
                id="grossWeight"
                value={grossWeight}
                type='number'
                className="!rounded-r-none"
                title="Peso Bruto:"
                placeholder="0.00"
                onChange={handleChange}
              />
              <Button className='bg-secondary !rounded-l-none h-[41px]' onClick={() => { }}>
                Leer
              </Button>
            </div>
            <div className="mt-5">
              <Input
                id="netWeight"
                value={netWeight}
                type='number'
                className="!rounded-r-none"
                title="Peso Neto:"
                placeholder="0.00"
                onChange={handleChange}
              />
            </div>
          </div>

          {
            // Materia Prima
            destination === "D02" &&
            <>
              <div>
                <span>Tipo de Carga</span>
                <div className="flex gap-4 pt-4">
                  <label htmlFor="kilos" className="flex gap-2">
                    <input type="radio" name="chargeType" id="kilos" value="KG" />
                    <span>kilos</span>
                  </label>
                  <label htmlFor="litros" className="flex gap-2">
                    <input type="radio" name="chargeType" id="litros" value="LTS" />
                    <span>Litros</span>
                  </label>
                </div>
              </div>
              {
                chargeType === "LTS" &&
                <Select
                  name="density"
                  title="Densidad"
                  defaultOption="-"
                  options={density}
                  onChange={() => { }}
                />
              }
            </>
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
                <input type="checkbox" name="auth-check" id="auth-check" />
                <label htmlFor="auth-check" className="cursor-pointer">Autorización de salida</label>
              </div>
              <Input
                id="authorization"
                value={OS_AUTHORIZATION}
                type="text"
                className="w-full !rounded-r-none"
                onChange={handleChange}
              />
            </div>
          }

          <Textarea
            id="details"
            value={details}
            title="Observaciones de salida"
            className="h-60"
            onChange={handleChange}
            placeholder="📝 ..."
            required={false}
          />

          <Button type="submit" className="bg-secondary">Procesar</Button>

        </Form>
      </Modal>
      <NotificationModal alertProps={[alert, handleAlert]} />
    </>
  )
}

export default VehiclesExit
