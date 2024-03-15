import TableEntrys from '@/components/pages/TableEntrys';
import TableVehicules from '@/components/pages/TableVehicules';
import VehiclesExit from '@/components/pages/VehiculesExit';

import Modal from '@/components/widgets/Modal';
import { getFormattedDistEntries } from '@/services/entries';
import { getTransports } from '@/utils';
import { format } from 'date-fns';
import React, { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react'


const DisEntrys = () => {

  const [showModal, setModal] = useState<boolean>(false)
  const [entrys, setEntrys] = useState<Entry[]>([])
  
  const [selectedEntry, setSelectedEntry] = useState<Entry>({
    entryNumber: "",
    entryDate: "",
    driver: {
      name: "",
      cedula: "",
      code: "",
    },
    vehicule: {
      id: "",
      plate: "",
      model: "",
      type: "",
      capacity: 0,
      company: "",
    },
    destination: "D01",
    operation: "",
    origin: "",
    truckWeight: 0,
    grossWeight: 0,
    netWeight: 0,
    details: "",
    invoice: "",
    aboutToLeave: false,
  })
  
  // console.log(entrys)

  // const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
  //   console.log(target.value)
  // }

  useEffect(() => {
    (async ()=>{
      
      const entries = await getFormattedDistEntries('entry')
      setEntrys(entries.filter(({ aboutToLeave }) => aboutToLeave))
      
    })() 
  }, [])
  

  console.log()

  return (
    <>
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
                <TableEntrys
                  key={i} 
                  setModal={setModal} 
                  setSelectedEntry={setSelectedEntry} 
                  entry={entry}
                />
              )
            }
          </tbody>
        </table>
      
      </main>
    </>
  )
}

export default DisEntrys