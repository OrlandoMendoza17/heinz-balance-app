import React, { ChangeEventHandler, useState } from 'react'
import Input from '../widgets/Input'
import Button from '../widgets/Button'
import { FaSearch } from 'react-icons/fa'
import { AxiosError } from 'axios'
import getErrorMessage from '@/utils/services/errorMessages'
import NotificationModal from '../widgets/NotificationModal'
import useNotification from '@/hooks/useNotification'

type Props = {
  id: string,
  title: string,
  placeholder: string,
  searchInfo: (searchValue: string) => Promise<void>
}

const VehiculeEntranceSearch = ({ searchInfo, ...props }: Props) => {

  const [alert, handleAlert] = useNotification()
  
  const [searchValue, setSearch] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange: ChangeEventHandler<HTMLInputElement> = async ({target}) => {
    setSearch(target.value)
  }
  
  const handleSearch = async () => {
    setLoading(true)
    try {
      
      if(searchValue) {
        await searchInfo(searchValue)
      }
      
      setLoading(false)
    
    } catch (error) {
      setLoading(false)
      
      console.log(error)
      let message = "Ha habido un error en la consulta"
      
      if(error instanceof AxiosError){
        debugger
        const errorMessage = error.response?.data.message
        message = getErrorMessage(errorMessage)
      }
      
      handleAlert.open(({
        type: "danger",
        title: "Error ❌",
        message,
      }))
    }
  }

  return (
    <div className="grid grid-cols-[1fr_auto] items-end">
      <Input
        {...props}
        value={searchValue}
        className="w-full"
        onChange={handleChange}
      />
      <Button
        onClick={handleSearch}
        className='bg-secondary !rounded-l-none'
        style={{ height: "41px" }}
        loading={loading}
      >
        <FaSearch className="fill-white" />
      </Button>
      <NotificationModal alertProps={[alert, handleAlert]} />
    </div>
  )
}

export default VehiculeEntranceSearch