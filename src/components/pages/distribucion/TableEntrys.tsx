import React, { MouseEventHandler, SetStateAction } from 'react'
import { DESTINATION_BY_CODE } from '@/lib/enums'
import { shortDate } from '@/utils/parseDate'

type Props = {
  setModal: (value: SetStateAction<boolean>) => void,
  setSelectedEntry: (value: SetStateAction<Entry>) => void,
  entry: Entry
}

const TableEntrys = ({setModal, setSelectedEntry, entry}: Props) => {
  
  const handleClick: MouseEventHandler<HTMLTableRowElement> = () => {
    // alert("Hello! I'm the radio demon! 👹")
    setModal(true)
    setSelectedEntry(entry)
  }
  
  const { entryNumber, driver, vehicule, destination, entryDate} = entry
  
  return (
    <tr onClick={handleClick}>
      <td>{entryNumber}</td>
      <td>{shortDate(entryDate)}</td>
      <td>{driver.name}</td>
      <td>{vehicule.plate}</td>
      <td>{DESTINATION_BY_CODE[destination]}</td>
    </tr>
  )
}

export default TableEntrys