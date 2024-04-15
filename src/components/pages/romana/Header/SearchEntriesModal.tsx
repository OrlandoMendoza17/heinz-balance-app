import React, { ChangeEventHandler, Dispatch, SetStateAction } from 'react'
import Modal from '../../../widgets/Modal'
import Input from '../../../widgets/Input'

type Props = {
  handleModal: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ]
}

const SearchEntriesModal = ({ handleModal }: Props) => {

  const [showModal, setModal] = handleModal

  
  
  const handleChange: ChangeEventHandler<HTMLInputElement> = () => {

  }

  return (
    <Modal {...{ showModal, setModal }}>
      <h2 className="font-bold pb-10">Buscar Entradas de Vehículos</h2>
      <form className="grid grid-cols-3 gap-5">
        <Input
          id="origin"
          // value={origin}
          className="w-full"
          title="Código de Entrada"
          // placeholder="VALENCIA"
          onChange={handleChange}
        />
        <Input
          id="origin"
          // value={origin}
          className="w-full"
          title="Cédula del Chofer"
          // placeholder="VALENCIA"
          onChange={handleChange}
        />
        <Input
          id="origin"
          // value={origin}
          className="w-full"
          title="Placa del Vehículo"
          // placeholder="VALENCIA"
          onChange={handleChange}
        />
      </form>
    </Modal>
  )
}

export default SearchEntriesModal