import React, { ChangeEventHandler, FormEventHandler, useState } from 'react'
import Input from '../widgets/Input'
import Button from '../widgets/Button'
import { FaSearch } from 'react-icons/fa'
import { AxiosError } from 'axios'
import getErrorMessage from '@/utils/services/errorMessages'
import NotificationModal from '../widgets/NotificationModal'
import useNotification from '@/hooks/useNotification'
import Form from '../widgets/Form'

type Props = {
  id: string,
  title: string,
  placeholder: string,
  createButton: string,
  handleCreateButton: () => void,
  searchInfo: (searchValue: string) => Promise<void>,
  disabled?: boolean,
}

const VehiculeEntranceSearch = ({ searchInfo, createButton, disabled = false, handleCreateButton, ...props }: Props) => {

  const [alert, handleAlert] = useNotification()

  const [searchValue, setSearch] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange: ChangeEventHandler<HTMLInputElement> = async ({ target }) => {
    setSearch(target.value.toUpperCase())
  }

  const handleSearch: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {

      if (searchValue) {
        await searchInfo(searchValue)
      }

      setLoading(false)

    } catch (error) {
      setLoading(false)
      console.log(error)

      let message = "Ha habido un error en la consulta"

      if (error instanceof AxiosError) {
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
    <Form onSubmit={handleSearch} className="VehiculeEntranceSearch">
      <Input
        {...props}
        value={searchValue}
        className="w-full"
        disabled={disabled}
        onChange={handleChange}
        required={false}
      />
      <Button
        type="submit"
        className='bg-secondary !rounded-l-none'
        style={{ height: "41px" }}
        loading={loading}
      >
        <FaSearch className="fill-white" />
      </Button>
      <button type="button" className="create-btn" onClick={handleCreateButton}>
        {createButton}
      </button>
      <NotificationModal alertProps={[alert, handleAlert]} />
    </Form>
  )
}

export default VehiculeEntranceSearch