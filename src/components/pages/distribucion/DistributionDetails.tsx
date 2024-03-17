import Modal from '@/components/widgets/Modal'
import { DESTINATION_BY_CODE } from '@/lib/enums'
import distributionEntry from '@/utils/defaultValues/distributionEntry'
import { getCuteFullDate, getDateTime } from '@/utils/parseDate'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  entry: DistributionEntry
}

const DistributionDetails = ({ showModal, setModal, entry }: Props) => {
  
  const [selectedEntry, setSelectedEntry] = useState<DistributionEntry>(distributionEntry)
  
  useEffect(() => {
    setSelectedEntry(entry)
  }, [entry])
  
  const { entryNumber, vehicule, driver, entryDate, entryDetails, origin, truckWeight } = selectedEntry
  
  return (
    <>
      <Modal className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_950px)]" {...{ showModal, setModal }}>
        <h1 className="font-semibold pb-10">Detalle</h1>
        <div className='grid gap-x-5 gap-y-8'>
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
              <p>{selectedEntry.palletsQuatity}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Control de Paleta: </span>
              <p>{selectedEntry.palletChargePlan}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Plan de Carga: </span>
              <p>{selectedEntry.chargePlan}</p>
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
              <span className="font-semibold">Peso Adicional: </span>
              <p>{selectedEntry.aditionalWeight}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Peso Neto Calculado: </span>
              <p>{selectedEntry.calculatedNetWeight}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Peso de Paletas: </span>
              <p>{selectedEntry.palletWeight}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Destino de Carga: </span>
              <p>{selectedEntry.chargeDestination}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Autorización de Salida: </span>
              <p>{selectedEntry.exitAuthorization}</p>
            </li>
            <li className="bg-blue-100 p-2">
              <span className="font-semibold">Estatus de Vehículo: </span>
              <p>{selectedEntry.vehiculeStatus}</p>
            </li>
          </ul>
        </div>
      </Modal>
    </>
  )
}

export default DistributionDetails