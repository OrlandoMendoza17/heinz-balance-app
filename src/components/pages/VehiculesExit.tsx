import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from 'react'
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
import { createNewExit } from '@/services/entries'
import { format } from 'date-fns'

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

type ChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>

const VehiclesExit = ({ showModal, setModal, entry }: Props) => {

  const [alert, handleAlert] = useNotification()
  const [OS_AUTHORIZATION, setOS_AUTHORIZATION] = useState({
    enabled: false,
    content: "",
  })  
  
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
  })

  useEffect(() => {
    setSelectedEntry(entry)
  }, [entry])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {

      const { entryNumber: ENT_NUM, invoice, truckWeight, details, destination, operation, ac } = selectedEntry

      // Si es Descarga o es Devoluación
      
      const leavingEntry: NewExit = {
        ENT_NUM: '95505',
        USU_LOG: 'USR9509C',
        SAL_FEC: getDateTime(),
        ENT_PES_TAR: truckWeight,
        ENT_PES_NET: Math.abs(grossWeight - truckWeight), 
        SAL_PES_BRU: grossWeight,
        DEN_COD: null,
        SAL_DEN_LIT: null,
        SAL_OBS: (details === "") ? details : null,
      }

      const table_values: TABLE_VALUES = {
        "D01": undefined,
        "D02": undefined,
        "D03": undefined,
        "D04": undefined,
        "D05": { // ✅
          ENT_NUM,
          ENT_PRO: origin,
          OPE_COD: operation,
          MAT_COD: null    // Este codigo se pone en la salida pero aquí se manda en null
        },
        "D07": { // ✅
          ENT_NUM,
          ENT_OS_PRO: origin,
          ENT_OS_AUT: OS_AUTHORIZATION.enabled ? OS_AUTHORIZATION.content : null
        },
      }

      // Dependiendo si es undefined o si trae un valor es porque sí se actualiza o no
      const updateEntryByDestination = table_values[destination]

      console.log('leavingEntry', leavingEntry)
      console.log('updateEntryByDestination', updateEntryByDestination)

      await createNewExit({ leavingEntry, updateEntryByDestination })

      handleAlert.open(({
        type: "success",
        title: "Salida de Vehículo",
        message: `Se ha procesado la salida del vehículo exitosamente"`,
      }))

    } catch (error) {
      handleAlert.open(({
        type: "danger",
        title: "Error ❌",
        message: "Ha habido un error procesando la entrada del vehículo, intentelo de nuevo",
      }))
    }
  }

  const handleChange: ChangeHandler = async ({ target }) => {
    type DESTINATION_VALUES = { DES_COD: DES_COD, OPE_COD: string }

    setSelectedEntry({
      ...selectedEntry,
      [target.id]: target.value,
    })
  }

  console.log("HOY", getDateTime())
  console.log("Otra Fecha", getDateTime("2024-11-02 00:19"))
  
  const { entryNumber, vehicule, driver, entryDate, destination, origin, truckWeight, grossWeight, netWeight } = selectedEntry

  return (
    <>
      <Modal className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_750px)]" {...{ showModal, setModal }}>
        <h1 className="font-semibold pb-10">Procesar Salida de Vehículo</h1>
        <div className='grid gap-x-5 gap-y-8'>

          <ul className="grid grid-cols-2 gap-5">
            <li>Código de entrada: <br />{entryNumber}</li>
            <li>Cédula del Chofer: <br />{driver.cedula}</li>
            <li>Fecha de Entrada: <br />{getCuteFullDate(entryDate)}</li>
            <li>Fecha de Salida: <br />{getCuteFullDate(getDateTime())}</li>
            <li>Placa del Vehículo: <br />{vehicule.plate}</li>
            <li>Procedencia: <br />{origin}</li>
            <li>Destino: <br />{DESTINATION_BY_CODE[destination]}</li>
            <li>Peso Tara: <br />{truckWeight}</li>
            <li className="grid grid-cols-[1fr_auto] items-end mt-5">
              <Input
                id="truckWeight"
                value={grossWeight}
                type='number'
                className="w-full !rounded-r-none"
                title="Peso Bruto:"
                placeholder="0.00"
                onChange={handleChange}
              />
              <Button className='bg-secondary !rounded-l-none' style={{ maxHeight: "41px" }} onClick={() => { }}>
                Leer Peso
              </Button>
            </li>
            <li className="mt-5">
              <Input
                id="netWeight"
                value={netWeight}
                type='number'
                className="w-full !rounded-r-none"
                title="Peso Neto:"
                placeholder="0.00"
                onChange={handleChange}
              />
            </li>
          </ul>
          
          <div>
            <label htmlFor="">
              <input type="checkbox" name="" id="" />
              <span>Aut</span>
            </label>
            
          </div>
          
          <Textarea
            id="details"
            value={""}
            title="Observaciones de salida"
            className=""
            onChange={handleChange}
            placeholder="📝 ..."
            required={false}
          />

          <Button type="submit" className="bg-secondary">Procesar</Button>

        </div>
      </Modal>
      <NotificationModal alertProps={[alert, handleAlert]} />
    </>
  )
}

export default VehiclesExit
