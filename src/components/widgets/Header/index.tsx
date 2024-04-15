import React, { MouseEventHandler, useState } from 'react'
import { FaFilePen, FaTruck, FaDoorOpen } from "react-icons/fa6";
import { RiRefreshLine } from "react-icons/ri";
import { IconType } from 'react-icons';
import VehiculesEntrance from '../../pages/VehiculesEntrance';
import SearchButton from '../../pages/romana/Header/SearchButton';
import User from './User';

export type NavbarListItem = {
  title: string;
  Icon: IconType;
  handleClick: MouseEventHandler<HTMLLIElement>;
}

type Props = {
  refreshEntries: () => Promise<void>;
}

const Header = ({ refreshEntries }: Props) => {

  const [showModal, setModal] = useState<boolean>(false)

  const [showDropBtn, setShowDropBtn] = useState<boolean>(false)

  const navList: NavbarListItem[] = [
    {
      title: "Procesar Entrada de Vehículo",
      Icon: FaFilePen,
      handleClick: () => {
        setModal(true)
      }
    },
    {
      title: "Vehículos en planta",
      Icon: FaTruck,
      handleClick: () => { }
    },
    // {
    //   title: "Buscar",
    //   Icon: BiSearchAlt,
    //   handleClick: () => { }
    // },
    // {
    //   title: "Procesar Entrada de Vehículo",
    //   Icon: LiaListAlt,
    //   handleClick: () => { }
    // },

    {
      title: "Recargar entradas en planta",
      Icon: RiRefreshLine,
      handleClick: refreshEntries,
    },
  ]
  
  return (
    <>
      <header className="Header">
        <nav>
          <ul>
            {navList.map(({ title, Icon, handleClick }, i) =>
              <li key={i} className={showDropBtn ? "z-10 relative" : ""} onClick={handleClick} {...{ title }}>
                <Icon size={25} />
              </li>
            )}
            <SearchButton handleDropBtn={[showDropBtn, setShowDropBtn]} />
          </ul>

          <User />

        </nav>
      </header>

      <VehiculesEntrance {...{ showModal, setModal, refreshEntries }} />

    </>
  )
}

export default Header