import React from 'react'
import { FaTruck } from 'react-icons/fa6'

type Props = {
  message: string,
  className?: string,
}

const NoEntries = ({ message, className = "h-screen" }: Props) => {
  return (
    <div className={`py-40 flex flex-col justify-center items-center gap-10 ${className} `}>
      <FaTruck className="fill-secondary" size={50} />
      <p className="max-w-2xl text-center italic">
        {message}
      </p>
    </div>
  )
}

export default NoEntries