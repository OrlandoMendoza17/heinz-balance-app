import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from 'react'
import Modal from '../widgets/Modal'
import Button from '../widgets/Button'
import Input from '../widgets/Input'
import useNotification from '@/hooks/useNotification'
import NotificationModal from '../widgets/NotificationModal'
import { AxiosError } from 'axios'
import getErrorMessage from '@/utils/services/errorMessages'
import { createDriver, getDriver } from '@/services/transportInfo'
import Form from '../widgets/Form'

type Props = {
  showDriverModal: boolean,
  setDriverModal: Dispatch<SetStateAction<boolean>>,
}

const CreateDriverModal = ({ showDriverModal, setDriverModal }: Props) => {

  const [loading, setLoading] = useState<boolean>(false)

  const [alert, handleAlert] = useNotification()

  const [newDriver, setNewDriver] = useState<NewDriverDto>({
    name: "",
    cedula: "",
    originID: 0,
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      handleAlert.close()
      
      let driver: Driver | undefined = undefined;

      try {

        driver = await getDriver(cedula, "CON_CED")

      } catch (error) {
        console.log('error', error)
      }

      if (driver?.cedula !== cedula) {
        const { name, cedula } = newDriver

        const SIPVEH_ORIGIN = 0

        const driver: T_CON = {
          CON_COD: cedula,
          CON_NOM: name,
          CON_CED: cedula,
          ORI_ID: SIPVEH_ORIGIN,
        }

        // Cuando el conductor se crea desde SIPVEH (ORI_ID = 0), el CON_COD es la misma cédula del mismo
        // Cuando el conductor se crea desde J.D.E  (ORI_ID = 1), el CON_COD es AUTOMÁTICO o INDETERMINADO

        await createDriver(driver)

        handleAlert.open(({
          type: "success",
          title: "Creación de Chofer",
          message: `Se ha creado un nuevo chofer exitosamente"`,
        }))
        
        setTimeout(() => setDriverModal(false), 3000)

      } else {
        handleAlert.open(({
          type: "warning",
          title: "Cédula Duplicada",
          message: `No es posible crear un nuevo conductor con una cédula ya registrada"`,
        }))
        setLoading(false)
      }

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

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = ({ target }) => {
    setNewDriver({
      ...newDriver,
      [target.name]: target.value,
    })
  }

  const { name, cedula } = newDriver

  return (
    <Modal showModal={showDriverModal} setModal={setDriverModal} targetModal="SmallModal">
      <h4 className="font-semibold pb-10">Nuevo Chofer</h4>
      <Form
        onSubmit={handleSubmit}
        className="grid gap-5"
      >
        <Input
          id="name"
          value={name}
          className="w-full"
          title="Nombre del Chofer"
          placeholder="ORLANDO MENDOZA"
          onChange={handleChange}
        />
        <Input
          id="cedula"
          value={cedula}
          className="w-full"
          title="Cédula del Chofer"
          placeholder="27313279"
          onChange={handleChange}
        />
        <Button loading={loading} type="submit" className="bg-secondary mt-5">
          Crear
        </Button>
      </Form>
      <NotificationModal alertProps={[alert, handleAlert]} />
    </Modal>
  )
}

export default CreateDriverModal