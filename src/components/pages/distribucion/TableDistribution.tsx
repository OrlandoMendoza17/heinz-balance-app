import React, { Children, Dispatch, SetStateAction } from 'react'
import TRDistEntries from './TRDistEntries'
import { EntriesType } from '@/services/entries'

type Props = {
  ENTRIES_TYPE: EntriesType,
  children: JSX.Element[]
}

const TableDistribution = ({ ENTRIES_TYPE, children }: Props) => {
  return (
    <table className="Entries">
      <thead>
        <tr>
          <th>N° de Entrada</th>
          <th>Nombre</th>
          <th>Cedula</th>
          <th>Placa</th>
          <th>Procedencia</th>
          <th>Fecha de Entrada</th>
          {
            (ENTRIES_TYPE !== "entry" && ENTRIES_TYPE !== "aboutToLeave") &&
            <th></th>
          }
        </tr>
      </thead>
      <tbody>
        {
          children
        }
      </tbody>
    </table>
  )
}

export default TableDistribution