import Button from '@/components/widgets/Button'
import Form from '@/components/widgets/Form'
import Input from '@/components/widgets/Input'
import Modal from '@/components/widgets/Modal'
import Textarea from '@/components/widgets/Textarea'
import { HandleNotification } from '@/hooks/useNotification'
import { getChargePlan } from '@/services/chargePlan'
import { EntriesType, getEntry, updateDistEntry, updateEntry } from '@/services/entries'
import { getMaterials } from '@/services/materials'
import distributionEntry from '@/utils/defaultValues/distributionEntry'
import { getCuteFullDate, getDateTime } from '@/utils/parseDate'
import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from 'react'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  entry: DistributionEntry,
  ENTRIES_TYPE: EntriesType,
  editEntries?: boolean,
  handleAlert: HandleNotification,
  setEntries: Dispatch<SetStateAction<DistributionEntry[]>>
}

const DEPARTMENT_AREAS = {
  entry: "",
  initial: "Despacho",
  dispatch: "Vehículos por salir",
  aboutToLeave: "",
  all: "",
}

const DistributionDetails = ({ showModal, setModal, entry, ENTRIES_TYPE, editEntries = false, handleAlert, setEntries }: Props) => {

  const [loading, setLoading] = useState<boolean>(false)
  const [selectedEntry, setSelectedEntry] = useState<DistributionEntry>(distributionEntry)

  useEffect(() => {
    setSelectedEntry(entry)
  }, [entry])

  const BOTH_ENABLED_EDIT = ((ENTRIES_TYPE === "initial" || ENTRIES_TYPE === "dispatch") && editEntries)
  const DESPATCH_ENABLED_EDIT = (ENTRIES_TYPE === "dispatch" && editEntries)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)

      const { entryNumber, origin, guideNumber, calculatedNetWeight, palletsQuatity, palletWeight } = selectedEntry
      const { chargePlan, chargeDestination, aditionalWeight, aditionalWeightDescription, vehiculeStatus } = selectedEntry
      const { exitAuthorization, dispatchNote, palletChargePlan, distDetails } = selectedEntry

      const PALLET_DEFAULT_WEIGHT = 30

      const ENT_DI_DPA = aditionalWeight ? (aditionalWeightDescription || null) : null

      const distEntry: P_ENT_DI = {
        ENT_NUM: entryNumber,                                        // ✅ Número de entrada                  | SIEMPRE 
        USU_LOG: "yherrera",                                         // ✅ Usuario que modificó la entrada    | SIEMPRE
        ENT_DI_FEC: getDateTime(),                                   // ✅ Fecha de edición de la entrada     | SIEMPRE
        ENT_DI_PRO: origin,                                          // ✅ Procedencia                        | SIEMPRE
        ENT_DI_GUI: chargePlan,                                      // ✅ Número de Guía     (Plan de carga) | SIEMPRE
        ENT_DI_PNC: calculatedNetWeight,                             // ✅ Peso Neto Calculado                | SIEMPRE - SE COLOCA ABAJO CON LA INFO DEL PLAN DE CARGA
        ENT_DI_CPA: palletChargePlan ? palletsQuatity : 0,           // ✅ Cantidad de Paletas                |         - Se manda en 0    si no se coloca cantidad de paletas ni control de paleta
        ENT_DI_PPA: palletChargePlan ?
          palletWeight : PALLET_DEFAULT_WEIGHT,        // ✅ Peso de las paletas                |         - Se manda en null si no se coloca cantidad de paletas ni control de paleta
        ENT_DI_PLA: chargePlan,                                      // ✅ Plan de carga                      | SIEMPRE
        ENT_DI_DES: chargeDestination,                               // ✅ Destino de carga                   | SIEMPRE - SE COLOCA ABAJO CON LA INFO DEL PLAN DE CARGA
        ENT_DI_PAD: aditionalWeight || 0,                            // ✅ Peso adicional corregido           |         - Se manda en 0 si no hay diferencia de peso
        ENT_DI_DPA,                                                  // ✅ Descripción del Peso Adicional     |         - Se manda en null si no hay peso adicional (DEBE COLOCARSE COMO OBLIGLATORIO CUANDO HAY DIFERENCIA DE PESO)
        ENT_DI_STA: 1,                                               // ✅ Estatus del Vehículo               |         - En distribución siempre es 1
        ENT_DI_AUT: exitAuthorization || null,                       // ✅ Autorización de Salida             |         - Se manda en null si es string vacío
        ENT_DI_NDE: chargePlan,                                      // ✅ Nota de despacho   (Plan de carga) | SIEMPRE
        ENT_DI_PAL: palletsQuatity ? palletChargePlan : null,        // ✅ Control de paletas (Plan de carga) |         - Si hay cantidad de paletas, se debe mandar, sino es null
        ENT_DI_OBS: distDetails || null,                             // ✅ Observaciones (Este)
        ENT_DI_REV: false,                                           // 1 | 0 (Aparentemente siempre es 0)
      }

      if (BOTH_ENABLED_EDIT) {
        const chargePlanInfo = await getChargePlan(chargePlan as string)

        const chargePlanNumber = chargePlanInfo.number.toString()

        // La asignación de estos 3 valores hace que la aplicación los detecte como que están en despacho
        distEntry.ENT_DI_GUI = chargePlanNumber;
        distEntry.ENT_DI_PLA = chargePlanNumber;
        distEntry.ENT_DI_NDE = chargePlanNumber;
        distEntry.ENT_DI_DES = chargePlanInfo.destination;

        distEntry.ENT_DI_PNC = (
          (entry.calculatedNetWeight === null) ? chargePlanInfo.weight :
            (entry.chargePlan === chargePlan) ? calculatedNetWeight : chargePlanInfo.weight
        )

        // Si se añaden paletas
        if (DESPATCH_ENABLED_EDIT && palletChargePlan) {
          distEntry.ENT_DI_PAL = chargePlanNumber;
        }
      }

      if (DESPATCH_ENABLED_EDIT) {
        const { ENT_NUM, ...rest } = await getEntry(entryNumber)

        const udpatedEntry: UpdateP_ENT = {
          ...rest,
          ENT_FLW: 2, // La asignación de este valor indica que lo manda a "por salir"
        }

        await updateEntry(entryNumber, udpatedEntry)
      }

      console.log('distEntry', distEntry)
      debugger
      await updateDistEntry(distEntry)

      setEntries((entries) =>
        entries.filter(({ entryNumber }) => entryNumber !== distEntry.ENT_NUM)
      )

      handleAlert.open(({
        type: "success",
        title: "Actualización de entrada",
        message: `Se ha guardados los datos de la entrada exitosamente y se ha mandado a "${DEPARTMENT_AREAS[ENTRIES_TYPE]}"`,
      }))

      setLoading(false)
      setModal(false)

    } catch (error) {
      setLoading(false)
      console.log(error)
      handleAlert.open(({
        type: "danger",
        title: "Error ❌",
        message: "Ha habido un error guardando los datos, por favor intentelo de nuevo",
      }))
    }
  }

  const { entryNumber, vehicule, driver, entryDate, entryDetails, origin, truckWeight } = selectedEntry

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = ({ target }) => {
    setSelectedEntry({
      ...selectedEntry,
      [target.name]: target.value
    })
  }

  return (
    <>
      <Modal className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_950px)]" {...{ showModal, setModal }}>
        <h1 className="font-semibold pb-10">Detalle</h1>
        <Form onSubmit={handleSubmit} className='grid gap-x-5 gap-y-8'>

          Datos Básicos

          <ul className="grid grid-cols-3 gap-5">
            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Número de Entrada: </span>
              <p>{entryNumber}</p>
            </li>
            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Fecha de Entrada: </span>
              <p>{getCuteFullDate(entryDate)}</p>
            </li>
            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Nombre del Chofer: </span>
              <p>{driver.name}</p>
            </li>
            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Cédula del Chofer: </span>
              <p>{driver.cedula}</p>
            </li>
            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Placa del Vehículo: </span>
              <p>{vehicule.plate}</p>
            </li>
            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Tranporte: </span>
              <p>{vehicule.company}</p>
            </li>
            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Peso Tara: </span>
              <p>{truckWeight}</p>
            </li>
            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Procedencia: </span>
              <p>{origin}</p>
            </li>
            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Observaciones en Entrada: </span>
              <p>{entryDetails}</p>
            </li>
          </ul>

          Entrada a Distribución

          <ul className="grid grid-cols-3 gap-5">
            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Cantidad de Paletas: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <Input type="number" onChange={handleChange} className="block" id="palletsQuatity" value={selectedEntry.palletsQuatity || 0} />
                  :
                  <p>{selectedEntry.palletsQuatity}</p>
              }
            </li>

            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Control de Paleta: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <Input
                    type="text"
                    onChange={handleChange}
                    className="block"
                    id="palletChargePlan"
                    value={selectedEntry.palletChargePlan || ""}
                    required={false}
                  />
                  :
                  <p>{selectedEntry.palletChargePlan}</p>
              }
            </li>

            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Plan de Carga: </span>
              {
                BOTH_ENABLED_EDIT ?
                  <Input
                    pattern="[0-9]*"
                    type="text"
                    onChange={handleChange}
                    className="block"
                    id="chargePlan"
                    value={selectedEntry.chargePlan || ""}
                  />
                  :
                  <p>{selectedEntry.chargePlan}</p>
              }
            </li>

            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Nota de Despacho: </span>
              <p>{selectedEntry.dispatchNote}</p>
            </li>

            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Número de Guía: </span>
              <p>{selectedEntry.guideNumber}</p>
            </li>

            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Peso Neto Calculado: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <Input type="number" onChange={handleChange} className="block" id="calculatedNetWeight" value={selectedEntry.calculatedNetWeight || 0} />
                  :
                  <p>{selectedEntry.calculatedNetWeight}</p>
              }
            </li>

            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Peso Adicional: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <Input type="number" onChange={handleChange} className="block" id="aditionalWeight" value={selectedEntry.aditionalWeight} />
                  :
                  <p>{selectedEntry.aditionalWeight}</p>
              }
            </li>

            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Peso de Paletas: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <Input type="number" onChange={handleChange} className="block" id="palletWeight" value={selectedEntry.palletWeight || 30} />
                  :
                  <p>{selectedEntry.palletWeight}</p>
              }
            </li>

            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Destino de Carga: </span>
              <p>{selectedEntry.chargeDestination}</p>
            </li>

            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Autorización de Salida:</span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <Input
                    type="text"
                    id="exitAuthorization"
                    onChange={handleChange}
                    className="block"
                    value={selectedEntry.exitAuthorization || ""}
                    required={false}
                  />
                  :
                  <p>{selectedEntry.exitAuthorization}</p>
              }
            </li>

            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Estatus de Vehículo: </span>
              <p>{selectedEntry.vehiculeStatus}</p>
            </li>

            <li className="bg-sky-50 p-2">
              <span className="font-semibold">Observaciones: </span>
              {
                BOTH_ENABLED_EDIT ?
                  <Textarea
                    className="block"
                    onChange={handleChange}
                    id="distDetails"
                    value={selectedEntry.distDetails || ""}
                    required={false}
                  />
                  :
                  <p>{selectedEntry.distDetails}</p>
              }
            </li>

          </ul>
          {
            editEntries &&
            <Button className="bg-secondary" type="submit" loading={loading}>
              Guardar
            </Button>
          }
        </Form>
      </Modal>
    </>
  )
}

export default DistributionDetails