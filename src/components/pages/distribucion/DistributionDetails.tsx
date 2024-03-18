import Button from '@/components/widgets/Button'
import Form from '@/components/widgets/Form'
import Modal from '@/components/widgets/Modal'
import { EntriesType } from '@/services/entries'
import distributionEntry from '@/utils/defaultValues/distributionEntry'
import { getCuteFullDate } from '@/utils/parseDate'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  entry: DistributionEntry,
  ENTRIES_TYPE: EntriesType,
  editEntries?: boolean,
}

const DistributionDetails = ({ showModal, setModal, entry, ENTRIES_TYPE, editEntries = false }: Props) => {

  "initial"
  "dispatch"

  const [selectedEntry, setSelectedEntry] = useState<DistributionEntry>(distributionEntry)

  useEffect(() => {
    setSelectedEntry(entry)
  }, [entry])

  const handleSubmit = () => {

    const { entryNumber, origin, guideNumber, calculatedNetWeight, palletsQuatity, palletWeight } = selectedEntry
    const { chargePlan, chargeDestination, aditionalWeight, aditionalWeightDescription, vehiculeStatus } = selectedEntry
    const { exitAuthorization, dispatchNote, palletChargePlan, distDetails } = selectedEntry

    const distEntry: P_ENT_DI = {
      ENT_NUM: entryNumber,
      USU_LOG: "yherrera",
      ENT_DI_FEC: new Date().toISOString(),
      ENT_DI_PRO: origin,
      ENT_DI_GUI: guideNumber,                   // (Distribución) - Plan de carga
      ENT_DI_PNC: calculatedNetWeight,           // (Distribución) - Peso Neto Calculado
      ENT_DI_CPA: palletsQuatity,                // (Distribución) - Cantidad de Paletas | Se manda en 0 en la romana
      ENT_DI_PPA: palletWeight,                  // (Distribución) - Peso de las paletas
      ENT_DI_PLA: chargePlan,                    // (Distribución) - Plan de carga
      ENT_DI_DES: chargeDestination,             // (Distribución) - Destino de carga
      ENT_DI_PAD: aditionalWeight,               // (Distribución) - Peso adicional corregido | Se manda en 0 en la romana
      ENT_DI_DPA: aditionalWeightDescription,    // (Distribución) - Algún tipo de descripción ❓
      ENT_DI_STA: vehiculeStatus,                // (Distribución) - Status (1 | null)
      ENT_DI_AUT: exitAuthorization,
      ENT_DI_NDE: dispatchNote,                  // (Distribución) - Plan de carga
      ENT_DI_PAL: palletChargePlan,              // (Distribución) - Plan de carga con paletas (si colocan cantidad de paletas deja de ser null) | NULL
      ENT_DI_OBS: distDetails,                   // (Distribución) - Observaciones
      ENT_DI_REV: false,                         // 1 | 0 (Aparentemente siempre es 0)
    }
  }

  const { entryNumber, vehicule, driver, entryDate, entryDetails, origin, truckWeight } = selectedEntry

  const BOTH_ENABLED_EDIT = ((ENTRIES_TYPE === "initial" || ENTRIES_TYPE === "dispatch") && editEntries)
  const DESPATCH_ENABLED_EDIT = (ENTRIES_TYPE === "dispatch" && editEntries)

  return (
    <>
      <Modal className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_950px)]" {...{ showModal, setModal }}>
        <h1 className="font-semibold pb-10">Detalle</h1>
        <Form className='grid gap-x-5 gap-y-8'>

          Datos Básicos

          <ul className="grid grid-cols-3 gap-5">
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Número de Entrada: </span>
              <p>{entryNumber}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Fecha de Entrada: </span>
              <p>{getCuteFullDate(entryDate)}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Nombre del Chofer: </span>
              <p>{driver.name}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Cédula del Chofer: </span>
              <p>{driver.cedula}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Placa del Vehículo: </span>
              <p>{vehicule.plate}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Tranporte: </span>
              <p>{vehicule.company}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Peso Tara: </span>
              <p>{truckWeight}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Procedencia: </span>
              <p>{origin}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Observaciones en Entrada: </span>
              <p>{entryDetails}</p>
            </li>
          </ul>

          Entrada a Distribución

          <ul className="grid grid-cols-3 gap-5">
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Cantidad de Paletas: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <input type="number" className="block" value={selectedEntry.palletsQuatity || 0} />
                  :
                  <p>{selectedEntry.palletsQuatity}</p>
              }
            </li>

            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Control de Paleta: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <input type="text" className="block" value={selectedEntry.palletChargePlan || ""} />
                  :
                  <p>{selectedEntry.palletChargePlan}</p>
              }
            </li>

            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Plan de Carga: </span>
              {
                BOTH_ENABLED_EDIT ?
                  <input type="text" className="block" value={selectedEntry.chargePlan || ""} />
                  :
                  <p>{selectedEntry.chargePlan}</p>
              }
            </li>

            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Nota de Despacho: </span>
              <p>{selectedEntry.dispatchNote}</p>
            </li>

            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Número de Guía: </span>
              <p>{selectedEntry.guideNumber}</p>
            </li>

            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Peso Neto Calculado: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <input type="number" className="block" value={selectedEntry.calculatedNetWeight || 0} />
                  :
                  <p>{selectedEntry.calculatedNetWeight}</p>
              }
            </li>

            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Peso Adicional: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <input type="number" className="block" value={selectedEntry.aditionalWeight} />
                  :
                  <p>{selectedEntry.aditionalWeight}</p>
              }
            </li>

            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Peso de Paletas: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <input type="number" className="block" value={selectedEntry.palletWeight || 30} />
                  :
                  <p>{selectedEntry.palletWeight}</p>
              }
            </li>

            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Destino de Carga: </span>
              <p>{selectedEntry.chargeDestination}</p>
            </li>

            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Autorización de Salida: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <input type="text" className="block" value={selectedEntry.exitAuthorization || ""} />
                  :
                  <p>{selectedEntry.exitAuthorization}</p>
              }
            </li>

            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Estatus de Vehículo: </span>
              <p>{selectedEntry.vehiculeStatus}</p>
            </li>

            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Observaciones: </span>
              {
                BOTH_ENABLED_EDIT ?
                  <textarea className="block" value={selectedEntry.distDetails || ""} />
                  :
                  <p>{selectedEntry.distDetails}</p>
              }
            </li>

          </ul>
          {
            editEntries && 
            <Button className="bg-secondary" type="submit">
              Guardar
            </Button>
          }
        </Form>
      </Modal>
    </>
  )
}

export default DistributionDetails