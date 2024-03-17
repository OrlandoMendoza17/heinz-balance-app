import React, { Children, Dispatch, SetStateAction } from 'react'
import TRDistEntries from './TRDistEntries'

type Props = {
  children: JSX.Element[]
}

const TableDistribution = ({children}: Props) => {
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