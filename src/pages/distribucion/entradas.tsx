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

const ENTRIES_TYPE: EntriesType = "entry"

const Entradas = () => {

  const [showModal, setModal] = useState<boolean>(false)
  const [entries, setEntries] = useState<DistributionEntry[]>([])

  const [editEntries, setEditEntries] = useState(false)

  const [alert, handleAlert] = useNotification()

  const [loading, setLoading] = useState<boolean>(false)

  const [selectedEntry, setSelectedEntry] = useState<DistributionEntry>(distributionEntry)

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
  )
}

export default Entradas