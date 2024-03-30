import React, { ChangeEventHandler, Dispatch, SetStateAction, useState } from 'react'
import Textarea from '../widgets/Textarea'
import Button from '../widgets/Button'
import { getFormattedDistEntries } from '@/services/entries'
import { SelectOptions } from '../widgets/Select'
import { HandleNotification } from '@/hooks/useNotification'

type Props = {
  exit: Exit,
  details: string,
  OS_AUTHORIZATION: string,
  densityOptions: SelectOptions[],
  materialsOptions: SelectOptions[],
  handleAlert: HandleNotification,
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  setSelectedExit: Dispatch<SetStateAction<Exit>>
}

const VehiculeExitDetails = (props: Props) => {
  
  const { handleAlert, handleChange, setSelectedExit } = props
  const { exit, details, OS_AUTHORIZATION, densityOptions, materialsOptions } = props

  const [loading, setLoading] = useState<boolean>(false)

  const getDetails = (async () => {
    try {
      setLoading(true)
      
      const { invoice, destination } = exit

      let details = ""

      const departments = {
        "D01": async () => { // Distribución
          
          const entries = await getFormattedDistEntries("aboutToLeave")
          const distEntry = entries.find(({ entryNumber }) => exit.entryNumber === entryNumber)

          if (distEntry) {
            const { chargePlan, calculatedNetWeight, chargeDestination } = distEntry
            details = `PLAN DE CARGA: ${chargePlan}\nPESO DE CARGA: ${calculatedNetWeight}\nDESTINO DE CARGA: ${chargeDestination}`
          }
        },
        "D02": () => { // Materia Prima

          const getDensity = () => {
            const density = document.getElementById("density") as HTMLSelectElement | undefined
            const densityValue = densityOptions.find(({ value }) => value === parseFloat(density?.value || ""))
            return densityValue?.name
          }

          const density = getDensity()

          details = `${invoice ? `FACTURA: ${invoice}\n` : ""}${density ? `DENSIDAD: ${density}` : ""}`
        },
        "D03": async () => { // Servicios Generales
          details = `${invoice ? `FACTURA: ${invoice}` : ""}`
        },
        "D04": async () => { // Almacén
          details = `${invoice ? `FACTURA: ${invoice}` : ""}`
        },
        "D05": async () => { // Materiales
          const getMaterial = () => {
            const material = document.getElementById("materials") as HTMLSelectElement | undefined
            const materialValue = materialsOptions.find(({ value }) => value === material?.value)
            return materialValue?.name
          }
          
          const material = getMaterial()
          details = `${material ? `TIPO DE MATERIAL: ${material}` : ""}`
        },
        "D07": async () => { //Otros Servicios
          details = `${OS_AUTHORIZATION ? `AUTORIZACION SALIDA: ${OS_AUTHORIZATION}` : ""}`
        },
      }

      await departments[destination]()
      
      if(details === ""){
        handleAlert.open({
          type:"warning",
          title: "Sin contenido",
          message: "No hay información para generar observaciones automáticamente"
        })
      }
      
      setSelectedExit((exit) => ({ ...exit, details }))

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
        id="details"
        value={details}
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