import TableVehicules from '@/components/pages/TableVehicules';
import VehiclesExit from '@/components/pages/VehiculesExit';
import Header from '@/components/widgets/Header'
import NoEntries from '@/components/widgets/NoEntries';
import NotificationModal from '@/components/widgets/NotificationModal';
import Spinner from '@/components/widgets/Spinner';
import useNotification from '@/hooks/useNotification';
import { getEntriesInPlant } from '@/services/entries';
import React, { useEffect, useState } from 'react'

const Romana = () => {

  const [showModal, setModal] = useState<boolean>(false)
  const [exits, setExits] = useState<Exit[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [alert, handleAlert] = useNotification()

  const [selectedExit, setSelectedExit] = useState<Exit>({
    entryNumber: "",
    entryDate: "",
    exitDate: "",
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
    action: 1,
    destination: "D01",
    operation: "",
    origin: "",
    weightDifference: 0,
    truckWeight: 0,
    grossWeight: 0,
    calculatedNetWeight: 0,
    netWeight: 0,
    entryDetails: "",
    exitDetails: "",
    invoice: "",
    palletWeight: 0,
    palletsQuatity: 0,
    aditionalWeight: 0,
    aboutToLeave: false,
  })

  useEffect(() => {
    getEntries()
  }, [])

  const getEntries = async () => {
    try {
      setLoading(true)

      const exits = await getEntriesInPlant()

      setExits(
        exits.map(({ entryDate, ...rest }) => (
          {
            ...rest,
            entryDate: entryDate.replace("T", " ").replace("Z", "")
          }
        ))
      )
      // setEntries(entries)

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
  }
  
  const leavingExits = exits.filter(({ aboutToLeave }) => aboutToLeave)

  return (
    <>
      <Header refreshEntries={getEntries} />
      <main className="Romana">
        {
          (!leavingExits.length && !loading) &&
          <NoEntries
            message='En estos momentos no hay níngun camión por salir en la planta'
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
                  <th>Acción</th>
                  <th>Fecha de Entrada</th>
                </tr>
              </thead>
              <tbody>
                {
                  leavingExits.map((exit, i) =>
                    <TableVehicules
                      key={i}
                      setModal={setModal}
                      setSelectedExit={setSelectedExit}
                      exit={exit}
                    />
                  )
                }
              </tbody>
            </table>
        }
        {
          showModal &&
          <VehiclesExit {...{ showModal, setModal, setExits, exit: selectedExit }} />
        }
        <NotificationModal alertProps={[alert, handleAlert]} />
      </main>
    </>
  )
}

export default Romana