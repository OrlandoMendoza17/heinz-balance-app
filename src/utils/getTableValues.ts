import { ACTION, STATUS } from "@/lib/enums"
import { getDateTime } from "./parseDate"
import { NewExit } from "@/components/pages/VehiculesExit"
import { SelectOptions } from "@/components/widgets/Select"
import { getFormattedDistEntries, getNextEntryNumber } from "@/services/entries"
import { splitString } from "./splitString"
export type NewEntry = Omit<P_ENT, "ENT_NUM">

type TABLE_VALUES = {
  D01: P_ENT_DI | undefined,
  D02: P_ENT_MP,
  D03: P_ENT_SG,
  D04: P_ENT_ALM,
  D05: P_ENT_MAT,
  D07: P_ENT_OS,
}

type DetailsParams = {
  exit: Exit,
  OS_AUTHORIZATION: string,
  densityOptions: SelectOptions[],
  materialsOptions: SelectOptions[],
}

type CommonParams = {
  DES_COD: DES_COD,
  OPE_COD: string,
  user: User,
}

type EntryParams = CommonParams & {
  vehicule: Vehicule,
  driver: Driver,
  action: Action | undefined,
  newEntry: NewEntryDto,
}

type ExitParams = CommonParams & {
  ENT_NUM: P_ENT["ENT_NUM"]
  material: string | null,
  OS_AUTHORIZATION: string,
  authCheck: boolean,
  selectedExit: Exit,
  density: number,
  exitDate: string,
  densityLts: number,
  exitDetails: string | undefined,
}

export const getDetails = async (params: DetailsParams) => {
  try {
    const MAX_CHARS = 250

    const { exit, OS_AUTHORIZATION } = params
    const { densityOptions, materialsOptions } = params

    const { invoice, destination } = exit

    let genetatedDetails = ""

    const departments = {
      "D01": async () => { // Distribución

        const entries = await getFormattedDistEntries("aboutToLeave")
        const distEntry = entries.find(({ entryNumber }) => exit.entryNumber === entryNumber)

        if (distEntry) {
          const { chargePlan, calculatedNetWeight, chargeDestination } = distEntry

          // Si no están alguno de estos es por es para devolución
          if (chargePlan && calculatedNetWeight && chargeDestination) {

            genetatedDetails = `PLAN DE CARGA: ${chargePlan}\nPESO DE CARGA: ${calculatedNetWeight}\nDESTINO DE CARGA: ${chargeDestination}`

          } else if (exit.action === ACTION.DEVOLUCION) {

            genetatedDetails = "TIKET DE SALIDA: PARA DEVOLUCION."

          } else if (exit.action === ACTION.TICKET_DE_SALIDA) {

            genetatedDetails = "TIKET DE SALIDA: SIN CARGA."

          }
        }
      },
      "D02": () => { // Materia Prima
        debugger
        const getDensity = () => {
          const density = document.getElementById("density") as HTMLSelectElement | undefined
          const densityValue = densityOptions.find(({ value }) => value === parseFloat(density?.value || ""))
          return densityValue?.name
        }

        const density = getDensity()

        genetatedDetails = `${invoice ? `FACTURA: ${invoice}\n` : ""}${density ? `DENSIDAD: ${density}` : ""}`
      },
      "D03": async () => { // Servicios Generales
        genetatedDetails = `${invoice ? `FACTURA: ${invoice}` : ""}`
      },
      "D04": async () => { // Almacén
        genetatedDetails = `${invoice ? `FACTURA: ${invoice}` : ""}`
      },
      "D05": async () => { // Materiales
        const getMaterial = () => {
          const material = document.getElementById("materials") as HTMLSelectElement | undefined
          const materialValue = materialsOptions.find(({ value }) => value === material?.value)
          return materialValue?.name
        }

        const material = getMaterial()
        genetatedDetails = `${material ? `TIPO DE MATERIAL: ${material}` : ""}`
      },
      "D07": async () => { //Otros Servicios
        genetatedDetails = `${OS_AUTHORIZATION ? `AUTORIZACION SALIDA: ${OS_AUTHORIZATION}` : ""}`
      },
    }

    await departments[destination]()

    const exitDetails = `${genetatedDetails}${exit.distDetails ? `\n\n${splitString(exit.distDetails)}` : ""}\n\n${splitString(exit.exitDetails)}`.slice(0, MAX_CHARS)

    return exitDetails;

  } catch (error) {
    console.log(error)
  }
}

export const getNewEntryValue = ({ vehicule, driver, action, DES_COD, OPE_COD, newEntry, user }: EntryParams) => {

  const getStatus = (): STATUS => {
    if (DES_COD === "D01") {
      return (action === ACTION.DEVOLUCION) ? STATUS.ABOUT_TO_LEAVE : STATUS.DISTRIBUTION
    } else {
      return STATUS.ABOUT_TO_LEAVE
    }
  }

  const { details, truckWeight } = newEntry

  const entry: NewEntry = {
    // ENT_NUM: "", // Esto es auto incremental
    ENT_FEC: getDateTime(),
    USU_LOG: user.accountName,
    VEH_ID: vehicule.id,
    CON_COD: driver.code,
    DES_COD,
    OPE_COD,
    ENT_PES_TAR: truckWeight,
    EMP_ID: null,
    ENT_OBS: (details !== "") ? details : null,
    ENT_FLW: getStatus(),
    ENT_FEC_COL: null,
    ENT_FLW_ACC: action,
  }

  return entry;
}

export const getNewEntryByDestinationValue = async ({ DES_COD, OPE_COD, user, newEntry }: EntryParams) => {

  const { invoice, origin } = newEntry
  const ENT_NUM = await getNextEntryNumber()

  const table_values: TABLE_VALUES = {
    "D01": { // Distribución
      ENT_NUM,
      USU_LOG: user.accountName,
      ENT_DI_FEC: getDateTime(),
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
      ENT_DI_REV: false,   // 1 | 0 (Siempre es 0 en la entrada) Esto indica que ha sido devuelto por diferencia de peso
    },
    "D02": { // ✅ Materia Prima
      ENT_NUM,
      ENT_MP_PRO: origin,
      ENT_MP_FAC: (invoice) ? invoice : null,
      ENT_MP_NOT: null,     // SIEMPRE NULL
      ENT_MP_PAL: null      // SIEMPRE NULL
    },
    "D03": { // ✅ Servicios Generales
      ENT_NUM,
      ENT_SG_PRO: origin,
      ENT_SG_FAC: (invoice) ? invoice : null,
      ENT_SG_NOT: null,
      ENT_SG_AUT: null,
      ENT_SG_NDE: null
    },
    "D04": { // ✅ Almacén
      ENT_NUM,
      ENT_ALM_PRO: origin,
      ENT_ALM_FAC: (invoice) ? invoice : null,
    },
    "D05": { // ✅ Materiales
      ENT_NUM,
      ENT_PRO: origin,
      OPE_COD,
      MAT_COD: null       // Este codigo se pone en la salida pero aquí se manda en null
    },
    "D07": { // ✅ Otros Servicios
      ENT_NUM,
      ENT_OS_PRO: origin,
      ENT_OS_AUT: null    // Se coloca en la salida en el caso de existir
    },
  }

  const entryByDestination = table_values[DES_COD]
  return entryByDestination;
}

export const getInsertExit = ({ ENT_NUM, user, exitDate, exitDetails, selectedExit, density, densityLts }: ExitParams) => {

  const { truckWeight, netWeight, grossWeight } = selectedExit

  const leavingEntry: NewExit = {
    ENT_NUM,
    USU_LOG: user.accountName,
    SAL_FEC: exitDate,
    ENT_PES_TAR: truckWeight,
    ENT_PES_NET: netWeight,
    SAL_PES_BRU: grossWeight,
    DEN_COD: null,        // Siempre es NULL
    SAL_DEN_LIT: density ? densityLts : null,
    SAL_OBS: (exitDetails !== "" && exitDetails !== undefined) ? exitDetails : null,
  }

  return leavingEntry;
}

export const getUpdateValue = ({ ENT_NUM, DES_COD, OPE_COD, material, selectedExit, OS_AUTHORIZATION, authCheck }: ExitParams) => {

  const { invoice, origin } = selectedExit

  const table_values: TABLE_VALUES = {
    "D01": undefined, // Distribución
    "D02": { // Materia Prima
      ENT_NUM,
      ENT_MP_PRO: origin,
      ENT_MP_FAC: (invoice) ? invoice : null,
      ENT_MP_NOT: null, // SIEMPRE NULL
      ENT_MP_PAL: null, // SIEMPRE NULL
    },
    "D03": { // Servicios Generales
      ENT_NUM,
      ENT_SG_PRO: origin,
      ENT_SG_FAC: (invoice) ? invoice : null,
      ENT_SG_NOT: null,
      ENT_SG_AUT: null,
      ENT_SG_NDE: null,
    },
    "D04": { // Almacén
      ENT_NUM,
      ENT_ALM_PRO: origin,
      ENT_ALM_FAC: (invoice) ? invoice : null,
    },
    "D05": {          // Materiales
      ENT_NUM,
      ENT_PRO: origin,
      OPE_COD,
      MAT_COD: material as string,       // Este codigo se pone en la salida pero aquí se manda en null
    },
    "D07": {          // Otros Servicios
      ENT_NUM,
      ENT_OS_PRO: origin,
      ENT_OS_AUT: !authCheck ? (OS_AUTHORIZATION || null) : null
    },
  }

  const updateEntryByDestination = table_values[DES_COD]
  return updateEntryByDestination;
}