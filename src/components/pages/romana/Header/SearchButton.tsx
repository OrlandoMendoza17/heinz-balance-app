import React, { Dispatch, SetStateAction, useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { RiLoginBoxLine, RiLogoutBoxLine } from 'react-icons/ri'
import SearchEntriesModal from './SearchEntriesModal'
import SearchExitsModal from './SearchExitsModal'
import { useRouter } from 'next/router'

type Props = {
  className?: string,
  handleDropBtn: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ]
}

const SearchButton = ({ handleDropBtn, className = "" }: Props) => {

  const router = useRouter()
  
  const [showDropBtn, setShowDropBtn] = handleDropBtn

  const [showEntriesModal, setEntriesModal] = useState<boolean>(false)
  const [showExitsModal, setExitsModal] = useState<boolean>(false)

  const handleEntriesModal = () => {
    setEntriesModal(true)
    setExitsModal(false)
  }

  const handleExitsModal = () => {
    setExitsModal(true)
    setEntriesModal(false)
  }

  return (
    <>
      <li
        onClick={handleExitsModal}
        title="Buscar Salidas de Vehículos"
        className={`SearchButton flex gap-4 justify-start ${className}`}
      >
        <BiSearchAlt size={25} />
        {
          router.pathname !== "/romana" &&
          "Salida de Vehículos"
        }
      </li>

      <SearchEntriesModal handleModal={[showEntriesModal, setEntriesModal]} />
      <SearchExitsModal handleModal={[showExitsModal, setExitsModal]} />
    </>
  )
}

export default SearchButton