import React, { Dispatch, SetStateAction, useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { RiLoginBoxLine, RiLogoutBoxLine } from 'react-icons/ri'
import SearchEntriesModal from './SearchEntriesModal'
import SearchExitsModal from './SearchExitsModal'

type Props = {
  handleDropBtn: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ]
}

const SearchButton = ({ handleDropBtn }: Props) => {

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
        className="SearchButton"
        onClick={handleExitsModal}
      >
        <BiSearchAlt size={25} />
      </li>

      <SearchEntriesModal handleModal={[showEntriesModal, setEntriesModal]} />
      <SearchExitsModal handleModal={[showExitsModal, setExitsModal]} />

    </>
  )
}

export default SearchButton