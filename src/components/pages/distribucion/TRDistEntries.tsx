import React, { Dispatch, MouseEventHandler, SetStateAction } from 'react'
import { MdOutlineModeEdit } from "react-icons/md";
import { getCuteFullDate, shortDate } from '@/utils/parseDate'
import { EntriesType } from '@/services/entries';

type Props = {
  setModal: (value: SetStateAction<boolean>) => void,
  setSelectedEntry: (value: SetStateAction<DistributionEntry>) => void,
  entry: DistributionEntry,
  ENTRIES_TYPE: EntriesType,
  setEditEntries: Dispatch<SetStateAction<boolean>>
}

const TRDistEntries = ({ setModal, setSelectedEntry, entry, ENTRIES_TYPE, setEditEntries }: Props) => {

  const handleClick: MouseEventHandler<HTMLTableRowElement> = (event) => {
    const target = event.target as HTMLElement
    
    // alert("Hello! I'm the radio demon! 👹")
    
    // Esto quiere decir si lo que pulsa el usuario es el botón o la celda de la tabla
    // Si pulsa el botón, el modal te permite editar cierto contenido, sino solo visualización
    setEditEntries((target.nodeName !== "TD") ? true : false)
    
    setModal(true)
    setSelectedEntry(entry)
  }

  const { entryNumber, driver, vehicule, origin, entryDate, returned } = entry
  console.log('entry', entry)
  
  return (
    <tr onClick={handleClick} className={`${returned ? "bg-red-400 hover:bg-red-500" : ""}`}>
      <td>{entryNumber}</td>
      <td>{driver.name}</td>
      <td>{driver.cedula}</td>
      <td>{vehicule.plate}</td>
      <td>{origin}</td>
      <td>{getCuteFullDate(entryDate)}</td>
      {
        (ENTRIES_TYPE !== "entry" && ENTRIES_TYPE !== "aboutToLeave") &&
        <td>
          <div className="flex justify-center">
            <button className="bg-sky-500 hover:bg-sky-400 rounded-lg px-5 py-3">
              <MdOutlineModeEdit size={20} className="fill-white" />
            </button>
          </div>
        </td>
      }
    </tr>
  )
}

export default TRDistEntries