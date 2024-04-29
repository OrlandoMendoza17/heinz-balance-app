import { SelectOptions } from "@/components/widgets/Select"
import { HandleNotification } from "@/hooks/useNotification"
import { ACTION } from "@/lib/enums"
import { getFormattedDistEntries } from "@/services/entries"
import { ChangeEventHandler, Dispatch, SetStateAction } from "react"

type Params = {
  exit: Exit,
  OS_AUTHORIZATION: string,
  densityOptions: SelectOptions[],
  materialsOptions: SelectOptions[],
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
}

const splitString = (entryDetails: string) => {
  let details = ""

  const chunkLength = 40
  const limit = Math.trunc(entryDetails.length / chunkLength)

  for (let index = 0; index < limit; index++) {
    details += `${entryDetails.slice(chunkLength * index, (chunkLength * index) + chunkLength)}\n`
  }
  
  return details;
}

const getDetails = async (params: Params) => {
  try {
    const MAX_CHARS = 200

    const { exit, OS_AUTHORIZATION } = params
    const { densityOptions, materialsOptions } = params

    const { invoice, destination } = exit

    let exitDetails = ""
    let details = ""

    const departments = {
      "D01": async () => { // Distribución

        const entries = await getFormattedDistEntries("aboutToLeave")
        const distEntry = entries.find(({ entryNumber }) => exit.entryNumber === entryNumber)

        if (distEntry) {
          const { chargePlan, calculatedNetWeight, chargeDestination } = distEntry

          // Si no están alguno de estos es por es para devolución
          if (chargePlan && calculatedNetWeight && chargeDestination) {

            exitDetails = `PLAN DE CARGA: ${chargePlan}\nPESO DE CARGA: ${calculatedNetWeight}\nDESTINO DE CARGA: ${chargeDestination}`

          } else if (exit.action === ACTION.DEVOLUCION) {

            exitDetails = "TIKET DE SALIDA: PARA DEVOLUCION."

          } else if (exit.action === ACTION.TICKET_DE_SALIDA) {

            exitDetails = "TIKET DE SALIDA: SIN CARGA."

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

        exitDetails = `${invoice ? `FACTURA: ${invoice}\n` : ""}${density ? `DENSIDAD: ${density}` : ""}`
      },
      "D03": async () => { // Servicios Generales
        exitDetails = `${invoice ? `FACTURA: ${invoice}` : ""}`
      },
      "D04": async () => { // Almacén
        exitDetails = `${invoice ? `FACTURA: ${invoice}` : ""}`
      },
      "D05": async () => { // Materiales
        const getMaterial = () => {
          const material = document.getElementById("materials") as HTMLSelectElement | undefined
          const materialValue = materialsOptions.find(({ value }) => value === material?.value)
          return materialValue?.name
        }

        const material = getMaterial()
        exitDetails = `${material ? `TIPO DE MATERIAL: ${material}` : ""}`
      },
      "D07": async () => { //Otros Servicios
        exitDetails = `${OS_AUTHORIZATION ? `AUTORIZACION SALIDA: ${OS_AUTHORIZATION}` : ""}`
      },
    }

    const chunkLength = 40
    const limit = Math.trunc(exitDetails.length / chunkLength)

    for (let index = 0; index < limit; index++) {
      details += `${exitDetails.slice(chunkLength * index, (chunkLength * index) + chunkLength)}\n`
    }

    await departments[destination]()

    exitDetails = `${exitDetails}${exit.distDetails ? `\n\n${details}` : ""}`.slice(0, MAX_CHARS)

    return exitDetails;
    
  } catch (error) {
    console.log(error)
  }
}

export default getDetails