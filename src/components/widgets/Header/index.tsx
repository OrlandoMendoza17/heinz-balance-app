import React, { MouseEventHandler, useState } from 'react'
import { FaFilePen, FaTruck, FaDoorOpen } from "react-icons/fa6";
import { RiRefreshLine } from "react-icons/ri";
import { IconType } from 'react-icons';
import VehiculesEntrance from '../../pages/VehiculesEntrance';
import SearchButton from '../../pages/romana/Header/SearchButton';
import User from './User';
import { PiPackageFill } from 'react-icons/pi';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { MdEmojiTransportation } from "react-icons/md";
import { ROLS } from '@/lib/enums';

export type NavbarListItem = {
  title: string;
  Icon: IconType;
  handleClick: MouseEventHandler<HTMLLIElement>;
}

type Props = {
  refreshEntries?: () => Promise<void>;
}

const { ADMIN, VIGILANCIA, FACTURACION, DESPACHO } = ROLS

const Header = ({ refreshEntries = async () => { } }: Props) => {

  const router = useRouter()
  const [, credentials] = useAuth()
  const { user } = credentials

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
      title: "Re// debuggergar entradas en planta",
      Icon: RiRefreshLine,
      handleClick: refreshEntries,
    },
    // {
    //   title: "Vehículos en planta",
    //   Icon: FaTruck,
    //   handleClick: () => { }
    // },
    // {
    //   title: "Bus// debugger",
    //   Icon: BiSearchAlt,
    //   handleClick: () => { }
    // },
    // {
    //   title: "Procesar Entrada de Vehículo",
    //   Icon: LiaListAlt,
    //   handleClick: () => { }
    // },
  ]

  const navListDistribution = [
    {
      title: "Distribucion",
      Icon: PiPackageFill,
      link: "/distribucion/entradas",
    },
    {
      title: "Transporte",
      Icon: MdEmojiTransportation,
      link: "/transporte",
    },
  ]

  const goToRomana = {
    title: "Romana",
    Icon: FaTruck,
    link: "/romana",
  }

  if (user.rol === ADMIN && router.pathname !== "/romana")
    navListDistribution.unshift(goToRomana)

  return (
    <header className="Header">
      <nav>
        <ul className="list">
          {
            router.pathname === "/romana" &&
            <>
              {
                navList.map(({ title, Icon, handleClick }, i) =>
                  <li key={i} className={showDropBtn ? "z-10 relative" : ""} onClick={handleClick} {...{ title }}>
                    <Icon size={25} />
                  </li>
                )
              }
              <SearchButton className="romana" handleDropBtn={[showDropBtn, setShowDropBtn]} />
              <VehiculesEntrance {...{ showModal, setModal, refreshEntries }} />
            </>
          }

          {
            (user.rol === ADMIN || user.rol === VIGILANCIA || user.rol === FACTURACION || user.rol === DESPACHO) &&
            <>
              {
                router.pathname === "/romana" &&
                <span className="text-base">||</span>
              }
              {
                navListDistribution.map(({ title, Icon, link }, i) =>
                  <li key={i} {...{ title }}>
                    <Link href={link} className="flex gap-4 justify-start" >
                      <Icon size={25} />{title}
                    </Link>
                  </li>
                )
              }
            </>
          }
          {
            router.pathname !== "/romana" &&
            <SearchButton handleDropBtn={[showDropBtn, setShowDropBtn]} />
          }
        </ul>

        <User />

      </nav>
    </header>
  )
}

export default Header