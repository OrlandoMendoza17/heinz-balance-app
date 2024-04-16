import React, { useEffect } from 'react'
import User from './User'
import Link from 'next/link'
import { FaTruck } from 'react-icons/fa6'
import { PiPackageFill } from "react-icons/pi";
import useAuth from '@/hooks/useAuth';

const DistribucionHeader = () => {

  const navList = [
    {
      title: "Distribucion",
      Icon: PiPackageFill,
      link: "/distribucion/entradas",
      handleClick: () => { }
    },
    {
      title: "Transporte",
      Icon: FaTruck,
      link: "/transporte",
      handleClick: () => { }
    },
  ]

  return (
    <header className="Header">
      <nav>
        <ul>
          {
            navList.map(({ title, Icon, link, handleClick }, i) =>
              <li key={i} onClick={handleClick} {...{ title }}>
                <Link href={link} className="flex gap-4 justify-start" >
                  <Icon size={25} />{title}
                </Link>
              </li>
            )
          }
        </ul>

        <User />

      </nav>
    </header>
  )
}

export default DistribucionHeader