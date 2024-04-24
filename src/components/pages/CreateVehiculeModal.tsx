import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from 'react'
import Modal from '../widgets/Modal'
import Input from '../widgets/Input'
import Select, { SelectOptions } from '../widgets/Select'
import { createVehicule, getVehicule, getVehiculeModels } from '@/services/transportInfo'
import Button from '../widgets/Button'
import NotificationModal from '../widgets/NotificationModal'
import useNotification from '@/hooks/useNotification'
import { AxiosError } from 'axios'
import getErrorMessage from '@/utils/services/errorMessages'
import Form from '../widgets/Form'
import SearchTransport from './SearchTransport'

type Props = {
  showVehiculeModal: boolean,
  setVehiculeModal: Dispatch<SetStateAction<boolean>>,
}

const CreateVehiculeModal = ({ showVehiculeModal, setVehiculeModal }: Props) => {

  const [loading, setLoading] = useState<boolean>(false)
  const [showModal, setModal] = useState<boolean>(false)

  const [alert, handleAlert] = useNotification()

  const [models, setModels] = useState<SelectOptions[]>([])
  const [types, setTypes] = useState<SelectOptions[]>([])

  const [newVehicule, setNewVehicule] = useState<NewVehiculeDto>({
    plate: "",
    model: "",
    type: "",
    capacity: 0,
    company: "",
    originID: 0,
  })

  const [selectedTransport, setSelectedTransport] = useState<Transport>()

  useEffect(() => {
    (async () => {

      const getOptions = (array: string[]) => {
        const options: SelectOptions[] = array.map((item) => {
          return {
            name: item,
            value: item,
          }
        })
        return options;
      }

      const { models, types } = await getVehiculeModels()

      const modelOptions = getOptions(models)
      const typeOptions = getOptions(types)

      setModels(modelOptions)
      setTypes(typeOptions)

    })()
  }, [])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      handleAlert.close()
      
      let vehicule: Vehicule | undefined = undefined;

      const $form = new FormData(event.currentTarget)

      const { plate, capacity } = newVehicule

      const model = $form.get("model") as string
      const type = $form.get("type") as string

      const SIPVEH_ORIGIN = 0

      try {

        vehicule = await getVehicule(plate)

      } catch (error) {
        console.log('error', error)
      }

      debugger

      if (vehicule?.plate !== plate) {
        
        if (selectedTransport) {

          const vehicule: Omit<T_VEH, "VEH_ID"> = {
            // VEH_ID: "",
            VEH_PLA: plate,
            VEH_MOD: model,
            VEH_TIP: type,
            VEH_CAP: capacity,
            TRA_COD: selectedTransport.code,
            ORI_ID: SIPVEH_ORIGIN,
          }

          await createVehicule(vehicule)

          handleAlert.open(({
            type: "success",
            title: "Creación de Vehículo",
            message: `Se ha creado un nuevo vehículo exitosamente"`,
          }))

          setTimeout(() => setVehiculeModal(false), 3000)

        } else {

          handleAlert.open(({
            type: "warning",
            title: "Asignación de Transporte",
            message: `Para poder crear el vehículo es necesario asignarle una empresa transportista"`,
          }))

          setLoading(false)
        }

      } else {
        handleAlert.open(({
          type: "warning",
          title: "Placa Duplicada",
          message: `No es posible crear un Vehículo con una placa ya registrada"`,
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
    setNewVehicule({
      ...newVehicule,
      [target.name]: target.value,
    })
  }

  const { plate, capacity } = newVehicule

  return (
    <Modal showModal={showVehiculeModal} setModal={setVehiculeModal} targetModal="SmallModal">
      <h4 className="font-semibold pb-10">Nuevo Vehículo</h4>
      <Form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-5"
      >
        <Input
          id="plate"
          value={plate}
          className="w-full"
          title="Placa del Vehículo"
          placeholder="A73A71V"
          onChange={handleChange}
        />
        <Input
          id="capacity"
          value={capacity}
          className="w-full"
          title="Capacidad del Vehículo"
          placeholder="VALENCIA"
          onChange={handleChange}
        />
        <Select
          name="model"
          title="Modelo"
          defaultOption="Modelo"
          options={models}
          onChange={handleChange}
        />
        <Select
          name="type"
          title="Tipo"
          defaultOption="Tipo"
          options={types}
          onChange={handleChange}
        />
        <Button className="bg-slate-500" onClick={() => setModal(true)}>
          Buscar transporte
        </Button>
        {
          selectedTransport &&
          <div className="flex items-center">
            <span>{selectedTransport.name} - {selectedTransport.RIF}</span>
          </div>
        }
        <Button loading={loading} type="submit" className="bg-secondary mt-5 col-span-2">
          Crear Vehículo
        </Button>
      </Form>
      <SearchTransport {...{ showModal, setModal, selectedTransport, setSelectedTransport }} />
      <NotificationModal alertProps={[alert, handleAlert]} />
    </Modal>
  )
}

export default CreateVehiculeModal