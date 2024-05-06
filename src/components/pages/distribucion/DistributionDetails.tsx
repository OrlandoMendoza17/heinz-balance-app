import Button from '@/components/widgets/Button'
import ConfirmModal from '@/components/widgets/ConfirmModal'
import Form from '@/components/widgets/Form'
import Input from '@/components/widgets/Input'
import Modal from '@/components/widgets/Modal'
import Textarea from '@/components/widgets/Textarea'
import useAuth from '@/hooks/useAuth'
import useNotification, { HandleNotification } from '@/hooks/useNotification'
import { ACTION } from '@/lib/enums'
import { getChargePlan } from '@/services/chargePlan'
import { EntriesType, getEntry, getEntryDifference, updateDistEntry, updateEntry } from '@/services/entries'
import { getMaterials } from '@/services/materials'
import distributionEntry from '@/utils/defaultValues/distributionEntry'
import { getCuteFullDate, getDateTime } from '@/utils/parseDate'
import getErrorMessage from '@/utils/services/errorMessages'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from 'react'
import { IoWarning } from "react-icons/io5";

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


  const [, credentials] = useAuth()
  const { user } = credentials
  const router = useRouter()

  const [confirm, handleConfirm] = useNotification()
  const [loading, setLoading] = useState<boolean>(false)

  const [exitTicketEnabled, setExitTicketEnabled] = useState<boolean>(false)

  const [selectedEntry, setSelectedEntry] = useState<DistributionEntry>(distributionEntry)

  const [entryDif, setEntryDif] = useState<EntryDif>()

  useEffect(() => {
    (async () => {
      setSelectedEntry(entry)
      try {
        const entryDif = await getEntryDifference(entry.entryNumber)
        setEntryDif(entryDif)
      } catch (error) {
        console.log('error', error)
      }
    })()
  }, [entry])

  const BOTH_ENABLED_EDIT = ((ENTRIES_TYPE === "initial" || ENTRIES_TYPE === "dispatch") && editEntries)

  const INITIAL_ENABLED_EDIT = (ENTRIES_TYPE === "initial" && editEntries)
  const DESPATCH_ENABLED_EDIT = (ENTRIES_TYPE === "dispatch" && editEntries)

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const { entryNumber, origin, guideNumber, calculatedNetWeight, palletsQuatity, palletWeight } = selectedEntry
      const { chargePlan, chargeDestination, aditionalWeight, aditionalWeightDescription, vehiculeStatus } = selectedEntry
      const { exitAuthorization, dispatchNote, palletChargePlan, distDetails } = selectedEntry
      debugger
      const PALLET_DEFAULT_WEIGHT = 30

      const ENT_DI_DPA = aditionalWeight ? (aditionalWeightDescription || null) : null

      const distEntry: P_ENT_DI = {
        ENT_NUM: entryNumber,                                               // ✅ Número de entrada                  | SIEMPRE 
        USU_LOG: user.accountName,                                          // ✅ Usuario que modificó la entrada    | SIEMPRE
        ENT_DI_FEC: getDateTime(),                                          // ✅ Fecha de edición de la entrada     | SIEMPRE
        ENT_DI_PRO: origin,                                                 // ✅ Procedencia                        | SIEMPRE
        ENT_DI_GUI: chargePlan,                                             // ✅ Número de Guía     (Plan de carga) | SIEMPRE
        ENT_DI_PNC: calculatedNetWeight,                                    // ✅ Peso Neto Calculado                | SIEMPRE - SE COLOCA ABAJO CON LA INFO DEL PLAN DE CARGA
        ENT_DI_CPA: palletsQuatity ? (palletsQuatity as number) : 0,        // ✅ Cantidad de Paletas                |         - Se manda en 0    si no se coloca cantidad de paletas ni control de paleta
        ENT_DI_PPA: palletsQuatity ? palletWeight : PALLET_DEFAULT_WEIGHT,  // ✅ Peso de las paletas                |         - Se manda en null si no se coloca cantidad de paletas ni control de paleta
        ENT_DI_PLA: chargePlan,                                             // ✅ Plan de carga                      | SIEMPRE
        ENT_DI_DES: chargeDestination,                                      // ✅ Destino de carga                   | SIEMPRE - SE COLOCA ABAJO CON LA INFO DEL PLAN DE CARGA
        ENT_DI_PAD: aditionalWeight || 0,                                   // ✅ Peso adicional corregido           |         - Se manda en 0 si no hay diferencia de peso
        ENT_DI_DPA,                                                         // ✅ Descripción del Peso Adicional     |         - Se manda en null si no hay peso adicional (DEBE COLOCARSE COMO OBLIGLATORIO CUANDO HAY DIFERENCIA DE PESO)
        ENT_DI_STA: 1,                                                      // ✅ Estatus del Vehículo               |         - En distribución siempre es 1
        ENT_DI_AUT: exitAuthorization || null,                              // ✅ Autorización de Salida             |         - Se manda en null si es string vacío
        ENT_DI_NDE: chargePlan,                                             // ✅ Nota de despacho   (Plan de carga) | SIEMPRE
        ENT_DI_PAL: palletsQuatity ? palletChargePlan : null,               // ✅ Control de paletas (Plan de carga) |         - Si hay cantidad de paletas, se debe mandar, sino es null
        ENT_DI_OBS: distDetails || null,                                    // ✅ Observaciones (Este)
        ENT_DI_REV: false,                                                  // 1 | 0 (Aparentemente siempre es 0)
      }

      const { ENT_NUM, ...rest } = await getEntry(entryNumber)

      if (BOTH_ENABLED_EDIT && !exitTicketEnabled) {
        const chargePlanInfo = await getChargePlan(chargePlan as string)

        const chargePlanNumber = chargePlanInfo.number.toString()

        // La asignación de estos 3 valores hace que la aplicación los detecte como que están en despacho
        distEntry.ENT_DI_GUI = chargePlanNumber;
        distEntry.ENT_DI_PLA = chargePlanNumber;
        distEntry.ENT_DI_NDE = chargePlanNumber;
        distEntry.ENT_DI_DES = chargePlanInfo.destination;

        distEntry.ENT_DI_PNC = (
          (entry.calculatedNetWeight === null) ? chargePlanInfo.weight :
            (entry.chargePlan === chargePlan) ? 
              calculatedNetWeight : chargePlanInfo.weight
        )

        // Si se añaden paletas
        if (DESPATCH_ENABLED_EDIT && palletChargePlan) {
          distEntry.ENT_DI_PAL = chargePlanNumber;
        }
      }

      if (INITIAL_ENABLED_EDIT && exitTicketEnabled) {
        
        const udpatedEntry: UpdateP_ENT = {
          ...rest,
          ENT_FLW: 2, // La asignación de este valor indica que lo manda a "por salir"
          ENT_FLW_ACC: ACTION.TICKET_DE_SALIDA, // La asignación de TICKET_DE_SALIDA
        }

        const exitTicketDistEntry: P_ENT_DI = {
          ...distEntry,
          ENT_DI_PLA: "0",
          ENT_DI_GUI: "0",
          ENT_DI_PNC: 0,
          ENT_DI_DES: "SIN CARGA",
          ENT_DI_PAD: 0,
          ENT_DI_DPA: null,
          ENT_DI_NDE: "0",
        }

        await updateEntry(entryNumber, udpatedEntry)
        await updateDistEntry(exitTicketDistEntry)
      }

      if (DESPATCH_ENABLED_EDIT) {

        const udpatedEntry: UpdateP_ENT = {
          ...rest,
          ENT_FLW: 2, // La asignación de este valor indica que lo manda a "por salir"
        }

        await updateEntry(entryNumber, udpatedEntry)
      }

      console.log('distEntry', distEntry)
      await updateDistEntry(distEntry)

      setEntries((entries) =>
        entries.filter(({ entryNumber }) => entryNumber !== distEntry.ENT_NUM)
      )

      const area = exitTicketEnabled ? DEPARTMENT_AREAS.aboutToLeave : DEPARTMENT_AREAS[ENTRIES_TYPE]
      
      handleAlert.open(({
        type: "success",
        title: "Actualización de entrada",
        message: `Se ha guardados los datos de la entrada exitosamente y se ha mandado a "${area}"`,
      }))

      setLoading(false)
      setModal(false)

    } catch (error) {
      setLoading(false)
      console.log(error)

      let message = "Ha habido un error en la consulta"

      if (error instanceof AxiosError) {
        debugger
        const errorMessage = error.response?.data.message
        message = getErrorMessage(errorMessage)
      }

      handleAlert.open(({
        type: "danger",
        title: "Error ❌",
        message,
      }))
    }
  }

  const { entryNumber, vehicule, driver, entryDate, entryDetails, origin, truckWeight, returned } = selectedEntry

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = ({ target, currentTarget }) => {
    debugger
    const { name, value } = target
    if (name === "exit-ticket") {

      const checkbox = target as HTMLInputElement
      setExitTicketEnabled(checkbox.checked)

    } else if (name === "palletsQuatity") {
      setSelectedEntry({
        ...selectedEntry,
        [name]: value === "" ? value : parseInt(value)
      })
    } else {
      setSelectedEntry({
        ...selectedEntry,
        [name]: target.value
      })
    }
  }

  const handleOpenModal: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    type routes = "vehiculos" | "despacho"

    const name = router.pathname.replace("/distribucion/", "") as routes

    const direction = {
      vehiculos: "Despacho",
      despacho: "Por salir",
    }

    console.log('router', router)
    handleConfirm.open({
      type: "warning",
      title: "Advertencia",
      message: `¿Estás seguro de que quieres mandar el transporte a "${direction[name]}"?`
    })
  }

  return (
    <>
      <Modal className="py-10 !items-baseline overflow-auto !grid-cols-[minmax(auto,_950px)]" {...{ showModal, setModal }}>
        <h1 className="font-semibold pb-10">Detalle</h1>
        <Form onSubmit={handleOpenModal} className='grid gap-x-5 gap-y-8'>

          {
            returned &&
            <div className="bg-red-300 border-red-500 text-red-700 font-bold border-2 p-7 rounded-2xl flex gap-3 content-center">
              <IoWarning size={20} className="fill-red-700" />
              <p>El Vehículo fue devuelto debido a una diferencia en el peso {entryDif ? `de ${entryDif.weightDifference} KG` : ""}  </p>
            </div>
          }

          Datos Básicos

          <ul className="grid grid-cols-3 gap-5">
            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Número de Entrada: </span>
              <p>{entryNumber}</p>
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Fecha de Entrada: </span>
              <p>{getCuteFullDate(entryDate)}</p>
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Nombre del Chofer: </span>
              <p>{driver.name}</p>
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Cédula del Chofer: </span>
              <p>{driver.cedula}</p>
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Placa del Vehículo: </span>
              <p>{vehicule.plate}</p>
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Tranporte: </span>
              <p>{vehicule.company}</p>
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Peso Tara: </span>
              <p>{truckWeight}</p>
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Procedencia: </span>
              <p>{origin}</p>
            </li>
            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Observaciones en Entrada: </span>
              <p>{entryDetails}</p>
            </li>
          </ul>

          Entrada a Distribución

          <ul className="grid grid-cols-3 gap-5">
            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Nota de Despacho: </span>
              <p>{selectedEntry.dispatchNote}</p>
            </li>

            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Número de Guía: </span>
              <p>{selectedEntry.guideNumber}</p>
            </li>

            <li className="bg-sky-100 p-2">
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
                    maxLength={8}
                    required={!exitTicketEnabled}
                  />
                  :
                  <p>{selectedEntry.chargePlan}</p>
              }
            </li>

            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Destino de Carga: </span>
              <p>{selectedEntry.chargeDestination}</p>
            </li>

            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Estatus de Vehículo: </span>
              <p>{selectedEntry.vehiculeStatus}</p>
            </li>

            {
              INITIAL_ENABLED_EDIT && 
              (user.rol === "01" || user.rol === "06") ?
              <li className="col-start-3 pr-10 cursor-pointer content-center">
                <label htmlFor="exit-ticket" className="flex items-center gap-4">
                  <input id="exit-ticket" name="exit-ticket" type="checkbox" checked={exitTicketEnabled} onChange={handleChange} />
                  <span className="font-bold">Emitir Ticket de Salida</span>
                </label>
              </li>
              :
              <li></li>
            }

            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Peso de Paletas: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <Input type="number" onChange={handleChange} className="block" id="palletWeight" value={selectedEntry.palletWeight || 30} />
                  :
                  <p>{selectedEntry.palletWeight}</p>
              }
            </li>

            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Peso Adicional: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <Input type="number" onChange={handleChange} className="block" id="aditionalWeight" value={selectedEntry.aditionalWeight} />
                  :
                  <p>{selectedEntry.aditionalWeight}</p>
              }
            </li>

            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Peso Neto Calculado: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <Input type="number" onChange={handleChange} className="block" id="calculatedNetWeight" value={selectedEntry.calculatedNetWeight || 0} />
                  :
                  <p>{selectedEntry.calculatedNetWeight}</p>
              }
            </li>

            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Cantidad de Paletas: </span>
              {
                DESPATCH_ENABLED_EDIT ?
                  <Input type="text" onChange={handleChange} className="block" id="palletsQuatity" value={selectedEntry.palletsQuatity || 0} />
                  :
                  <p>{selectedEntry.palletsQuatity}</p>
              }
            </li>

            <li className="bg-sky-100 p-2">
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

            <li className="bg-sky-100 p-2">
              <span className="font-semibold">Observaciones: </span>
              {
                BOTH_ENABLED_EDIT ?
                  <Textarea
                    className="block"
                    maxLength={100}
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
      <ConfirmModal
        acceptAction={handleSubmit}
        confirmProps={[confirm, handleConfirm]}
      />
    </>
  )
}

export default DistributionDetails