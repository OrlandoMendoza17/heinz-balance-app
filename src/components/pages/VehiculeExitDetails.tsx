import React, { ChangeEventHandler, Dispatch, SetStateAction, useEffect, useState } from 'react'
import Textarea from '../widgets/Textarea'
import Button from '../widgets/Button'
import { getFormattedDistEntries } from '@/services/entries'
import { SelectOptions } from '../widgets/Select'
import { HandleNotification } from '@/hooks/useNotification'
import { ACTION } from '@/lib/enums'
import { getOneDistributionEntry } from '@/services/distribution/entries'

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

  const [chargePlan, setChargePlan] = useState<P_ENT_DI["ENT_DI_PLA"]>(null)
  
  const MAX_CHARS = 200

  useEffect(() => {
    (async ()=>{
      const { ENT_DI_PLA } = await getOneDistributionEntry(exit.entryNumber)
      setChargePlan(ENT_DI_PLA)
    })()
  }, [])

  return (
    <div className="VehiculeExitDetails">
      {
        Boolean(chargePlan) &&
        <small>Plan de Carga {"->"} <strong>{chargePlan}</strong></small>
      }
      {/* <Button loading={loading} onClick={getDetails}>Generar Observaciones</Button> */}
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