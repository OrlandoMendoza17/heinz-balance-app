import React, { ChangeEventHandler, Dispatch, SetStateAction, useState } from 'react'
import Textarea from '../widgets/Textarea'
import Button from '../widgets/Button'
import { getFormattedDistEntries } from '@/services/entries'
import { SelectOptions } from '../widgets/Select'
import { HandleNotification } from '@/hooks/useNotification'
import { ACTION } from '@/lib/enums'

type Props = {
  exit: Exit,
  exitDetails: string,
  OS_AUTHORIZATION: string,
  densityOptions: SelectOptions[],
  materialsOptions: SelectOptions[],
  handleAlert: HandleNotification,
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  setSelectedExit: Dispatch<SetStateAction<Exit>>
}

const VehiculeExitDetails = (props: Props) => {

  const { handleAlert, handleChange, setSelectedExit } = props
  const { exit, exitDetails, OS_AUTHORIZATION, densityOptions, materialsOptions } = props

  const [loading, setLoading] = useState<boolean>(false)
  
  const MAX_CHARS = 200
  
  const getDetails = (async () => {
    try {
      setLoading(true)

      const { invoice, destination } = exit
      
      let exitDetails = ""

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
      
      await departments[destination]()
      
      exitDetails = `${exitDetails}${exit.distDetails ? `\n\n${exit.distDetails}` : ""}`.slice(0, MAX_CHARS)

      if (exitDetails === "") {
        handleAlert.open({
          type: "warning",
          title: "Sin contenido",
          message: "No hay información para generar observaciones automáticamente"
        })
      }

      setSelectedExit((exit) => ({ ...exit, exitDetails }))

      setLoading(false)

    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  })

  return (
    <div className="VehiculeExitDetails">
      <Button loading={loading} onClick={getDetails}>Generar Observaciones</Button>
      <Textarea
        maxLength={MAX_CHARS}
        id="exitDetails"
        value={exitDetails}
        title="Observaciones de salida"
        className="h-60"
        onChange={handleChange}
        placeholder="📝 ..."
        required={false}
      />
    </div>
  )
}

export default VehiculeExitDetails