import React from 'react'
import { ChangeHandler } from './VehiculesEntrance'
import { ACTION } from '@/lib/enums'

type Props = {
  handleChange: ChangeHandler,
  DES_COD: string,
  action: ACTION | undefined,
}

const { CARGA, DESCARGA, DEVOLUCION, TICKET_DE_SALIDA } = ACTION

const CheckAction = ({ handleChange, DES_COD, action }: Props) => {
  const actions = [
    {
      id: "carga",
      title: "Carga",
      value: CARGA,
      disabled: false,
    },
    {
      id: "descarga",
      title: "Descarga",
      value: DESCARGA,
      disabled: !(DES_COD === "D02" || DES_COD === "D03" || DES_COD === "D04" || DES_COD === "D07"),
    },
    {
      id: "devolucion",
      title: "Devolución",
      value: DEVOLUCION,
      disabled: !(DES_COD === "D01"),
    },
  ]

  return (
    <div className="pt-12 flex justify-center items-center gap-5">
      {
        actions.map(({ id, title, value, disabled }) =>
          <label htmlFor={id}>
            <input
              name="action"
              type="radio"
              onChange={handleChange}
              className="mr-2"
              required
              checked={value === action}
              {...{ id, value, disabled }}
            />
            <span>{title}</span>
          </label>
        )
      }
    </div>
  )
}

export default CheckAction