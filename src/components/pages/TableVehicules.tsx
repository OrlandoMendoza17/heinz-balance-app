import { DESTINATION_BY_CODE } from '@/lib/enums'
import { shortDate } from '@/utils/parseDate'
import React, { MouseEventHandler, SetStateAction } from 'react'

type Props = {
  setModal: (value: SetStateAction<boolean>) => void,
  setSelectedTransport: (value: SetStateAction<Entry>) => void,
  entry: Entry
}

const TableVehicules = ({setModal, setSelectedTransport, entry}: Props) => {
  
  const handleClick: MouseEventHandler<HTMLTableRowElement> = () => {
    // alert("Hello! I'm the radio demon! 👹")
    setModal(true)
    setSelectedTransport(entry)
  }
  
  const { entryNumber, driver, vehicule, destination, entryDate, origin } = entry
  
  return (
    <tr onClick={handleClick}>
      <td>{entryNumber}</td>
      <td>{driver.name}</td>
      <td>{driver.cedula}</td>
      <td>{vehicule.plate}</td>
      <td>{origin}</td>
      <td>{DESTINATION_BY_CODE[destination]}</td>
      <td>{shortDate(entryDate)}</td>
    </tr>
  )
}

export default TableVehicules













