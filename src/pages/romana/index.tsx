import TableVehicules from '@/components/pages/TableVehicules';
import VehiclesExit from '@/components/pages/VehiclesExit';
import Header from '@/components/widgets/Header'
import Modal from '@/components/widgets/Modal';
import getAboutToLeaveEntries from '@/services/aboutToLeave';
import { getDestination, getOperation } from '@/services/plant';
import { getTransports } from '@/utils';
import { shortDate } from '@/utils/parseDate';
import React, { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react'


const Romana = () => {

  const [showModal, setModal] = useState<boolean>(false)
  const [entrys, setTransports] = useState<Entry[]>([])
  
  const [selectedEntry, setSelectedTransport] = useState<Entry>({
    entryNumber: "",
    driver: {
      name: "",
      cedula: "",
      code: "",
    },
    vehicule: {
      plate: "",
      model: "",
      type: "",
      capacity: 0,
      company: "",
    },
    destination: "D01",
    entryDate: "",
    origin: "",
    truckWeight: 0,
    grossWeight: 0,
    netWeight: 0,
  })
  
  // console.log(entrys)

  // const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
  //   console.log(target.value)
  // }

  useEffect(() => {
    (async ()=>{
      
      const entrys = await getAboutToLeaveEntries()
      setTransports(entrys)
      
    })() 
    
  }, [])
  

  return (
    <>
      <Header />
      <main className="Romana">
        {/* <input type="date" name="" id="" onChange={handleChange}/> */}
        <table className="Transport">
          <thead>
            <tr>
              <th>N° de Entrada</th>
              <th>Nombre</th>
              <th>Cedula</th>
              <th>Placa</th>
              <th>Procedencia</th>
              <th>Destino</th>
              <th>Fecha de Entrada</th>
            </tr>
          </thead>
          <tbody>
            {
              entrys.map((entry, i) =>
                <TableVehicules 
                  key={i} 
                  setModal={setModal} 
                  setSelectedTransport={setSelectedTransport} 
                  entry={entry}
                />
              )
            }
          </tbody>
        </table>
        <VehiclesExit {...{ showModal, setModal, entry: selectedEntry }} />
      </main>
    </>
  )
}

export default Romana