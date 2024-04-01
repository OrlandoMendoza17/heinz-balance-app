import React, { Dispatch, MouseEventHandler, SetStateAction } from 'react'

type Props = {
  transport: Transport,
  selectedTransport: Transport | undefined,
  setSelectedTransport: Dispatch<SetStateAction<Transport | undefined>>,
}

const TransportRows = ({ transport, selectedTransport, setSelectedTransport }: Props) => {

  const { name, RIF, code } = transport

  const handleClick: MouseEventHandler<HTMLTableRowElement> = () => {
    setSelectedTransport(transport)
  }

  return (
    <tr className={`${selectedTransport?.RIF === transport.RIF ? "selected" : ""}`} onClick={handleClick}>
      <td>{code}</td>
      <td>{RIF}</td>
      <td>{name}</td>
    </tr>
  )
}

export default TransportRows