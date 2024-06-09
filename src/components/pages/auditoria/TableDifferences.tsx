import React, { Dispatch, MouseEventHandler, ReactNode, SetStateAction } from 'react'
import { ACTION_BY_NAME, DESTINATION_BY_CODE } from '@/lib/enums'
import { getCuteFullDate, shortDate } from '@/utils/parseDate'
import Button from '@/components/widgets/Button'
import generateExcel from '@/utils/generateExcel'

const XLSX = require('../../../../node_modules/xlsx/xlsx.js')

type Props = {
  setSelectedExit: Dispatch<SetStateAction<Exit[]>>,
  exit: Exit
}

type DifferenceItemProps = {
  exit: Exit,
  entryDifference: EntryDif,
}

const DifferenceItem = ({ entryDifference }: DifferenceItemProps) => {

  const { entryDifferenceNumber, weightDifference } = entryDifference

  return (
    <li>
      <span className="font-bold">{entryDifferenceNumber}: </span>
      <span>{weightDifference} KG</span>
    </li>
  )
}

const TableDifferences = ({ setSelectedExit, exit }: Props) => {

  const handleClick: MouseEventHandler<HTMLTableRowElement> = () => {
    // alert("Hello! I'm the radio demon! 👹")
    // setSelectedExit(exit)
  }

  const { entryNumber, driver, vehicule, exitDate, origin, userAccountName } = exit
  const entryDifferences = exit.entryDifference as EntryDif[]

  return (
    <tr onClick={handleClick} className="TableDifferences">
      <td>{entryNumber}</td>
      <td>{driver.name}</td>
      <td>{driver.cedula}</td>
      <td>{vehicule.plate}</td>
      <td>{origin}</td>
      <td className="">
        <div className="display-row">
          <Button className="bg-secondary font-bold w-[45px]" onClick={() => { }}>
            {entryDifferences.length}
          </Button>
          <ul className="differences-window">
            {
              entryDifferences.map((entryDifference) =>
                <DifferenceItem {...{ exit, entryDifference }} />
              )
            }
            <li className="font-bold" onClick={() => generateExcel([exit])}>Descargar</li>
          </ul>
        </div>
      </td>
      <td>{getCuteFullDate(exitDate)}</td>
      <td className="text-sm">{userAccountName}</td>
    </tr>
  )
}

export default TableDifferences