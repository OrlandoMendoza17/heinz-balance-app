import React, { MouseEventHandler, SetStateAction } from 'react'
import { ACTION_BY_NAME, DESTINATION_BY_CODE } from '@/lib/enums'
import { getCuteFullDate, shortDate } from '@/utils/parseDate'

type Props = {
  setModal: (value: SetStateAction<boolean>) => void,
  setSelectedExit: (value: SetStateAction<Exit>) => void,
  exit: Exit
}

const TableVehicules = ({ setModal, setSelectedExit, exit }: Props) => {

  const handleClick: MouseEventHandler<HTMLTableRowElement> = () => {
    // alert("Hello! I'm the radio demon! 👹")
    setModal(true)
    setSelectedExit(exit)
  }

  const { entryNumber, driver, vehicule, action, destination, entryDate, origin } = exit

  return (
    <tr onClick={handleClick}>
      <td>{entryNumber}</td>
      <td>{driver.name}</td>
      <td>{driver.cedula}</td>
      <td>{vehicule.plate}</td>
      <td>{origin}</td>
      <td>{DESTINATION_BY_CODE[destination]}</td>
      <td>{ACTION_BY_NAME[action as Action]}</td>
      <td>{getCuteFullDate(entryDate)}</td>
    </tr>
  )
}

export default TableVehicules