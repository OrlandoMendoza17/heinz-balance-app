import { DESTINATION_BY_CODE } from '@/lib/enums'
import { getCuteFullDate } from '@/utils/parseDate'
import React, { useState } from 'react'
import PDFRender from '../../../widgets/PDFRender'

type Props = {
  exit: Exit,
}

const TRExits = ({ exit }: Props) => {

  const [rendered, setRendered] = useState<boolean>(false)

  const { entryNumber, vehicule, driver, entryDate, exitDate, grossWeight, destination } = exit
  
  const generateExitReport = () =>{
    setTimeout(() => {
      setRendered(true)
      setTimeout(() => setRendered(false), 3000)
    }, 1000)
  }
  
  return (
    <>
      <tr onClick={generateExitReport}>
        <td>
          <span>{entryNumber}</span>
        </td>
        {/* <td>
          <span>{vehicule.company}</span>
        </td> */}
        <td>
          <span>{vehicule.plate}</span>
        </td>
        <td>
          <span>{driver.name}</span>
        </td>
        <td>
          <span>{driver.cedula}</span>
        </td>
        {/* <td>
          <span>{getCuteFullDate(entryDate)}</span>
        </td> */}
        <td>
          <span>{getCuteFullDate(exitDate)}</span>
        </td>
        <td>
          <span>{grossWeight}</span>
        </td>
        <td>
          <span>{DESTINATION_BY_CODE[destination]}</span>
        </td>
      </tr>
      {
        rendered &&
        <PDFRender exit={exit} />
      }
    </>
  )
}

export default TRExits