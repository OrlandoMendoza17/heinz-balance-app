import React, { MouseEventHandler, useState } from 'react'
import { FaFilePen, FaTruck } from "react-icons/fa6";
import { FaQuestion } from "react-icons/fa";
import { LiaListAlt } from "react-icons/lia";
import { RiRefreshLine } from "react-icons/ri";
import { IconType } from 'react-icons';
import VehiculesEntrance from '../pages/VehiculesEntrance';
import useAuth from '@/hooks/useAuth';

type NavbarListItem = {
  title: string;
  Icon: IconType;
  handleClick: MouseEventHandler<HTMLLIElement>;
}

type Props = {
  refreshEntries: () => Promise<void>;
}

const Header = ({ refreshEntries }: Props) => {
  
  const [, credentials] = useAuth()
  const [showModal, setModal] = useState<boolean>(false)
  
  const navList: NavbarListItem[] = [
    {
      title: "Procesar Entrada de Vehículo",
      Icon: FaFilePen,
      handleClick: () =>{
        setModal(true)
      }
    },
    {
      title: "Procesar Salida de Vehículo",
      Icon: FaQuestion,
      handleClick: () =>{}
    },
    {
      title: "Procesar Entrada de Vehículo",
      Icon: LiaListAlt,
      handleClick: () =>{}
    },
    {
      title: "Procesar Entrada de Vehículo",
      Icon: FaTruck,
      handleClick: () =>{}
    },
    {
      title: "Recargar entradas en planta",
      Icon: RiRefreshLine,
      handleClick: refreshEntries,
    },
  ]
  
  const { nombre } = credentials.user
  
  return (
    <>
      <header className="Header">
        <nav>
          <ul>
            {navList.map(({ title, Icon, handleClick }, i) =>
              <li key={i} onClick={handleClick} {...{ title }}>
                <Icon size={25} />
              </li>
            )}
          </ul>
          <div className="User">
            <img src="https://media-iad3-2.cdn.whatsapp.net/v/t61.24694-24/267691681_405490171214648_7716399763638213971_n.jpg?ccb=11-4&oh=01_AdR8trXJHM7UVF-vAIlZGgurc9IdQpMSZn9QMmnA5elnQA&oe=65ED80DC&_nc_sid=e6ed6c&_nc_cat=105" alt="" />
            <span>Bienvenido <span className="font-bold text-sky-500">{nombre.split(" ")[1]}</span></span>
          </div>
        </nav>
      </header>
      
      {
        showModal &&
        <VehiculesEntrance {...{ showModal, setModal, refreshEntries }}/>
      }
      
    </>
  )
}

export default Header