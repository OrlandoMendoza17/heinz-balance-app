import Link from 'next/link'
import React from 'react'

const DistributionAside = () => {
  return (
    <aside className="DistributionAside">
      <nav>
        <ul className="grid gap-6">
          <li>
            <Link href="/distribucion/entradas">Entrada de Vehículos</Link>
          </li>
          <li>
            <Link href="/distribucion/vehiculos">Vehículos en Distribución</Link>
          </li>
          <li>
            <Link href="/distribucion/despacho">Vehículos en Despacho</Link>
          </li>
          <li>
            <Link href="/distribucion/por-salir">Vehículos por salir</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default DistributionAside