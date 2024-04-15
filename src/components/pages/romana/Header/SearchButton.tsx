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
        className="Search"
        onClick={() => console.log("Hola")}
        onMouseEnter={() => setShowDropBtn(true)}
        onMouseLeave={() => setShowDropBtn(false)}
      >
        <BiSearchAlt size={25} />
        {
          showDropBtn &&
          <>
            <ul className="drop-buttons">
              <li onClick={handleEntriesModal}><RiLoginBoxLine size={17} className="rotate-180" /> Entrada</li>
              <li onClick={handleExitsModal}><RiLogoutBoxLine size={17} className="rotate-180" /> Salida</li>
            </ul>
            {/* <div className="overlay"></div> */}
          </>
        }
      </li>

      <SearchEntriesModal handleModal={[showEntriesModal, setEntriesModal]} />
      <SearchExitsModal handleModal={[showExitsModal, setExitsModal]} />
      
    </>
  )
}

export default SearchButton