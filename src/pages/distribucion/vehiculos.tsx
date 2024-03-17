import React, { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react'
import TRDistEntries from '@/components/pages/distribucion/TRDistEntries';
import { getFormattedDistEntries } from '@/services/entries';
import useNotification from '@/hooks/useNotification';
import NotificationModal from '@/components/widgets/NotificationModal';
import DistributionAside from '@/components/widgets/DistributionAside';
import NoEntries from '@/components/widgets/NoEntries';
import Spinner from '@/components/widgets/Spinner';
import TableDistribution from '@/components/pages/distribucion/TableDistribution';
import distributionEntry from '@/utils/defaultValues/distributionEntry';

const Vehiculos = () => {
  
  const [showModal, setModal] = useState<boolean>(false)
  const [entries, setEntries] = useState<DistributionEntry[]>([])

  const [alert, handleAlert] = useNotification()

  const [loading, setLoading] = useState<boolean>(false)
  
  const [selectedEntry, setSelectedEntry] = useState<DistributionEntry>(distributionEntry)

  // const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
  //   console.log(target.value)
  // }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)

        const entries = await getFormattedDistEntries('initial')
        setEntries(entries)
        console.log('entries', entries)
        // setEntrys(entries.filter(({ aboutToLeave }) => aboutToLeave))
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
            message='En estos momentos no hay níngun camión registrado en distribución'
          />
        }
        {
          loading ?
            <Spinner size="normal" />
            :
            <TableDistribution>
              {
                entries.map((entry, i) =>
                  <TRDistEntries
                    key={i}
                    setModal={setModal}
                    setSelectedEntry={setSelectedEntry}
                    entry={entry}
                  />
                )
              }
            </TableDistribution>
        }
      </main>
      <NotificationModal alertProps={[alert, handleAlert]} />
    </div>
  )
}

export default Vehiculos