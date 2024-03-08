import VehiclesExit from '@/components/pages/VehiclesExit';
import Header from '@/components/widgets/Header'
import Modal from '@/components/widgets/Modal';
import { getDestination, getOperation } from '@/services/plant';
import { getTransports } from '@/utils';
import { shortDate } from '@/utils/parseDate';
import React, { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react'


const Romana = () => {

  const [showModal, setModal] = useState<boolean>(false)
  const transports = getTransports()
  // console.log(transports)

  // const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
  //   console.log(target.value)
  // }

  const handleClick: MouseEventHandler<HTMLTableRowElement> = () => {
    // alert("Hello! I'm the radio demon! 👹")
    setModal(true)
  }

  return (
    <>
      <Header />
      <main className="Romana">
        {/* <input type="date" name="" id="" onChange={handleChange}/> */}
        <table className="Transport">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cedula</th>
              <th>Placa</th>
              <th>Destino</th>
              <th>Fecha de Entrada</th>
            </tr>
          </thead>
          <tbody>
            {
              transports.map(({ driver, truckPlate, destination, entryDate }, i) =>
                <tr key={i} onClick={handleClick}>
                  <td>{driver.name}</td>
                  <td>{driver.cedula}</td>
                  <td>{truckPlate}</td>
                  <td>{destination}</td>
                  <td>{shortDate(entryDate)}</td>
                </tr>
              )
            }
          </tbody>
        </table>
        <VehiclesExit {...{ showModal, setModal }} />
      </main>
    </>
  )
}

export default Romana