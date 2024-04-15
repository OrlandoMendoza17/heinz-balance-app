import TableVehicules from '@/components/pages/TableVehicules';
import VehiclesExit from '@/components/pages/VehiculesExit';
import Header from '@/components/widgets/Header'
import NoEntries from '@/components/widgets/NoEntries';
import NotificationModal from '@/components/widgets/NotificationModal';
import Spinner from '@/components/widgets/Spinner';
import useAuth from '@/hooks/useAuth';
import useNotification from '@/hooks/useNotification';
import { getEntriesInPlant } from '@/services/entries';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const Romana = () => {
  
  const [renderPage, credentials] = useAuth()

  const router = useRouter()
  
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
    debugger
    const { user } = credentials
    if(renderPage){
      if(user.rol === "01" || user.rol === "02" || user.rol === "03"){
        
        getEntries()
      }else{
        router.push("/distribucion/entradas")
      }
    }
  }, [renderPage])

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
    renderPage &&
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
            <div className="flex items-center justify-center h-full">
              <Spinner size="normal" />
            </div>
            :
            <section>
              <h1>Vehículos por salir</h1>
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
            </section>
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