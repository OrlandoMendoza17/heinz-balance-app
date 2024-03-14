import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from 'react'
import Select, { SelectOptions } from '../widgets/Select'
import { getDestination } from '@/services/destination'
import Modal from '../widgets/Modal'
import Button from '../widgets/Button'
import Input from '../widgets/Input'
import Textarea from '../widgets/Textarea'
import { shortDate } from '@/utils/parseDate'
import { DESTINATION_BY_CODE } from '@/lib/enums'
import useNotification from '@/hooks/useNotification'
import NotificationModal from '../widgets/NotificationModal'
import { createNewExit } from '@/services/entries'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  entry: Entry
}

export type NewExit = P_SAL

type TABLE_VALUES = {
  D01: P_ENT_DI,
  D02: undefined,
  D03: undefined,
  D04: undefined,
  D05: P_ENT_MAT,
  D07: P_ENT_OS,
}

type ChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>

const VehiclesExit = ({ showModal, setModal, entry }: Props) => {

  const [alert, handleAlert] = useNotification()


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

      const { entryNumber: ENT_NUM, invoice, destination, operation } = selectedEntry

      const leavingEntry: NewExit = {
        ENT_NUM: '95505',
        USU_LOG: 'USR9509C',
        SAL_FEC: '2024-03-14T10:17:02.270Z',
        ENT_PES_TAR: 9110,
        ENT_PES_NET: 4070,
        SAL_PES_BRU: 5040,
        DEN_COD: null,
        SAL_DEN_LIT: null,
        SAL_OBS: null,
      }

      const table_values: TABLE_VALUES = {
        "D01": {
          ENT_NUM,
          USU_LOG: "USR9509C",
          ENT_DI_FEC: new Date().toISOString(),
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
          ENT_DI_REV: 0,       // 1 | 0 (Aparentemente siempre es 0)
        },
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
          ENT_OS_AUT: null
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

  const { entryNumber, vehicule, driver, entryDate, destination, origin, truckWeight, grossWeight, netWeight } = selectedEntry

  return (
    <>
      <Modal className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_750px)]" {...{ showModal, setModal }}>
        <h1 className="font-semibold pb-10">Procesar Salida de Vehículo</h1>
        <div className='grid gap-x-5 gap-y-8'>

          <ul className="grid grid-cols-2 gap-5">
            <li>Código de entrada: <br />{entryNumber}</li>
            <li>Cédula del Chofer: <br />{driver.cedula}</li>
            <li>Fecha de Entrada: <br />{shortDate(entryDate)}</li>
            <li>Fecha de Salida: <br />{shortDate(entryDate)}</li>
            <li>Placa del Vehículo: <br />{vehicule.plate}</li>
            <li>Procedencia: <br />{origin}</li>
            <li>Destino: <br />{DESTINATION_BY_CODE[destination]}</li>
            {/* <li>Operación: <br />{DESTINATION_BY_CODE[destination]}</li> */}
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
