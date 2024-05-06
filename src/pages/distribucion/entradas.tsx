import React, { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react'
import TRDistEntries from '@/components/pages/distribucion/TRDistEntries';
import { EntriesType, getFormattedDistEntries } from '@/services/entries';
import useNotification from '@/hooks/useNotification';
import NotificationModal from '@/components/widgets/NotificationModal';
import DistributionAside from '@/components/widgets/DistributionAside';
import NoEntries from '@/components/widgets/NoEntries';
import Spinner from '@/components/widgets/Spinner';
import TableDistribution from '@/components/pages/distribucion/TableDistribution';
import distributionEntry from '@/utils/defaultValues/distributionEntry';
import DistributionDetails from '@/components/pages/distribucion/DistributionDetails';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import Header from '@/components/widgets/Header';

const ENTRIES_TYPE: EntriesType = "entry"

const Entradas = () => {

  const router = useRouter()
  const [renderPage, credentials] = useAuth()
  
  const [showModal, setModal] = useState<boolean>(false)
  const [entries, setEntries] = useState<DistributionEntry[]>([])

  const [editEntries, setEditEntries] = useState(false)

  const [alert, handleAlert] = useNotification()

  const [loading, setLoading] = useState<boolean>(false)

  const [selectedEntry, setSelectedEntry] = useState<DistributionEntry>(distributionEntry)

  useEffect(() => {
    const { user } = credentials
    if(renderPage){
      if(user.rol === "01" || user.rol === "04" || user.rol === "05" || user.rol === "06"){
        
        // getEntries()
        
      }else if(user.rol === "02" || user.rol === "03"){
        
        router.push("/romana")
        
      }
    }
  }, [renderPage])
  
  useEffect(() => {
    (async () => {
      try {

        setLoading(true)

        const entries = await getFormattedDistEntries(ENTRIES_TYPE)
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
    renderPage &&
    <>
      <Header />
      <div className="Distribucion">
        <DistributionAside />
        <main className="grid justify-center">
          {
            (!entries.length && !loading) &&
            <NoEntries
              message='En estos momentos no hay níngun camión registrado realizando el proceso en el área de distribución'
            />
          }
          {
            loading ?
              <Spinner size="normal" />
              :
              <section className="pt-10">
                <h1 className="text-2xl font-bold">Entrada de Vehículos</h1>
                <TableDistribution ENTRIES_TYPE={ENTRIES_TYPE}>
                  {
                    entries.map((entry, i) =>
                      <TRDistEntries
                        key={i}
                        setModal={setModal}
                        setSelectedEntry={setSelectedEntry}
                        entry={entry}
                        ENTRIES_TYPE={ENTRIES_TYPE}
                        setEditEntries={setEditEntries}
                      />
                    )
                  }
                </TableDistribution>
              </section>
          }
        </main>
        <DistributionDetails {...{
          showModal,
          setModal,
          entry: selectedEntry,
          ENTRIES_TYPE,
          editEntries,
          handleAlert,
          setEntries,
        }} />
        <NotificationModal alertProps={[alert, handleAlert]} />
      </div>
    </>
  )
}

export default Entradas