import TableVehicules from '@/components/pages/TableVehicules';
import VehiclesExit from '@/components/pages/VehiculesExit';
import Button from '@/components/widgets/Button';
import Header from '@/components/widgets/Header'
import NoEntries from '@/components/widgets/NoEntries';
import NotificationModal from '@/components/widgets/NotificationModal';
import Spinner from '@/components/widgets/Spinner';
import useAuth from '@/hooks/useAuth';
import useNotification from '@/hooks/useNotification';
import { ROLS } from '@/lib/enums';
import { getEntriesInPlant } from '@/services/entries';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { PiPackageFill } from 'react-icons/pi';

const { ADMIN, SUPERVISOR_BALANZA, BALANZA } = ROLS

const Romana = () => {

  const [renderPage, credentials] = useAuth()

  const router = useRouter()

  const [showDistEntries, setShowDistEntries] = useState<boolean>(false)

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
      originID: 0,
    },
    vehicule: {
      id: "",
      plate: "",
      model: "",
      type: "",
      capacity: 0,
      company: "",
      companyID: "",
      originID: 0,
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
    distDetails: "",
    exitDetails: "",
    invoice: "",
    palletWeight: 0,
    palletsQuatity: 0,
    aditionalWeight: 0,
    userAccountName: "",
    aboutToLeave: false,
  })
  
  const { user } = credentials
  
  useEffect(() => {
    debugger
    if (renderPage) {
      if (user.rol === ADMIN || user.rol === SUPERVISOR_BALANZA || user.rol === BALANZA) {

        getEntries()
        
      } else {
        router.push("/distribucion/entradas")
      }
    }
  }, [renderPage])

  const getEntries = async () => {
    try {
      setLoading(true)

      const exits = await getEntriesInPlant()
      setExits(exits)

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

  const handleSwitch = () => {
    setShowDistEntries(!showDistEntries)
  }

  const distEntries = exits.filter(({ aboutToLeave }) => !aboutToLeave);
  const leavingExits = exits.filter(({ aboutToLeave }) => aboutToLeave)

  const displayExits = !showDistEntries ? leavingExits : distEntries
  // const displayExits = exits

  return (
    renderPage &&
    <>
      <Header refreshEntries={getEntries} />
      <main className="Romana">

        {
          loading ?
            <div className="flex items-center justify-center fullscreen">
              <Spinner size="normal" />
            </div>
            :
            <section>
              <div className="flex items-center h-[50px] gap-5">
                <Button
                  onClick={handleSwitch}
                  className={`Switch-button ${showDistEntries ? "active" : ""}`}
                >
                  <PiPackageFill className="fill-white" size={25} />
                </Button>
                {
                  !showDistEntries ?
                    <h1>Vehículos por salir ({leavingExits.length})</h1>
                    :
                    <h1>Vehículos en Distribución ({distEntries.length})</h1>
                }
              </div>
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
                    {
                      user.rol &&
                      <th>Usuario</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    displayExits.map((exit, i) =>
                      <TableVehicules
                        key={i}
                        showDistEntries={showDistEntries}
                        setModal={setModal}
                        setSelectedExit={setSelectedExit}
                        exit={exit}
                      />
                    )
                  }
                </tbody>
              </table>
              {
                (!leavingExits.length && !showDistEntries && !loading) &&
                <NoEntries
                  className="pt-60 pb-0"
                  message='En estos momentos no hay níngun camión por salir en la planta'
                />
              }
              {
                (!distEntries.length && showDistEntries && !loading) &&
                <NoEntries
                  className="pt-60 pb-0"
                  message='En estos momentos no hay níngun camión en proceso de Distribución'
                />
              }
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