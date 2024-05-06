import Link from 'next/link'
import { useRouter } from 'next/router'
import { title } from 'process'
import React from 'react'

const DistributionAside = () => {

  const router = useRouter()

  const links = [
    {
      title: "Entrada de Vehículos",
      href: "/distribucion/entradas"
    },
    {
      title: "Vehículos en Distribución",
      href: "/distribucion/vehiculos"
    },
    {
      title: "Vehículos en Despacho",
      href: "/distribucion/despacho"
    },
    {
      title: "Vehículos por salir",
      href: "/distribucion/por-salir"
    },
  ]

  return (
    <aside className="DistributionAside">
      <nav>
        <ul className="grid gap-6">
          {
            links.map(({ title, href }, i) =>
              <li key={i}>
                <Link href={href} className={`${href === router.pathname ? "active" : ""}`}>
                  {title}
                </Link>
              </li>
            )
          }
        </ul>
      </nav>
    </aside>
  )
}

export default DistributionAside