import TableVehicules from '@/components/pages/TableVehicules';
import VehiclesExit from '@/components/pages/VehiculesExit';
import Header from '@/components/widgets/Header'
import Modal from '@/components/widgets/Modal';
import NoEntries from '@/components/widgets/NoEntries';
import NotificationModal from '@/components/widgets/NotificationModal';
import Spinner from '@/components/widgets/Spinner';
import useNotification from '@/hooks/useNotification';
import { getEntriesInPlant } from '@/services/entries';
import { getTransports } from '@/utils';
import { format } from 'date-fns';
import React, { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react'


const Romana = () => {

  const [showModal, setModal] = useState<boolean>(false)
  const [entries, setEntries] = useState<Entry[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [alert, handleAlert] = useNotification()

  const [selectedEntry, setSelectedTransport] = useState<Entry>({
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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)

        const entries = await getEntriesInPlant()
        // setEntries(entries.filter(({ aboutToLeave }) => aboutToLeave))
        setEntries(entries)

        setLoading(false)

      } catch (error) {
        setLoading(false)
        console.log(error)
        handleAlert.open(({
          type: "danger",
          title: "Error ❌",
          message: "Ha habido un error trayendose las entradas de vehículos, intentelo de nuevo",
        }))
      }
    })()
  }, [])

  return (
    <>
      {/* <Header /> */}
      <main className="Romana">
        {
          (!entries.length && !loading) &&
          <NoEntries
            message='En estos momentos no hay níngun camión registrado en la planta'
          />
        }
        
        {
          loading ?
            <Spinner size="normal" />
            :
            <table className="Entries self-start">
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
                  entries.map((entry, i) =>
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
        }
        <VehiclesExit {...{ showModal, setModal, entry: selectedEntry }} />
        <NotificationModal alertProps={[alert, handleAlert]} />
      </main>
    </>
  )
}

export default Romana