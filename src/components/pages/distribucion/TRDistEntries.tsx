import React, { MouseEventHandler, SetStateAction } from 'react'
import { DESTINATION_BY_CODE } from '@/lib/enums'
import { getCuteFullDate, shortDate } from '@/utils/parseDate'

type Props = {
  setModal: (value: SetStateAction<boolean>) => void,
  setSelectedEntry: (value: SetStateAction<DistributionEntry>) => void,
  entry: DistributionEntry
}

const TRDistEntries = ({setModal, setSelectedEntry, entry}: Props) => {
  
  const handleClick: MouseEventHandler<HTMLTableRowElement> = () => {
    // alert("Hello! I'm the radio demon! 👹")
    setModal(true)
    setSelectedEntry(entry)
  }
  
  const { entryNumber, driver, vehicule, origin, entryDate} = entry
  
  return (
    <tr onClick={handleClick}>
      <td>{entryNumber}</td>
      <td>{driver.name}</td>
      <td>{driver.cedula}</td>
      <td>{vehicule.plate}</td>
      <td>{origin}</td>
      <td>{getCuteFullDate(entryDate)}</td>
    </tr>
  )
}

export default TRDistEntries