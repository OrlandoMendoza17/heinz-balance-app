import React from 'react'
import { FaTruck } from 'react-icons/fa6'

type Props = {
  message: string,
}

const NoEntries = ({ message }: Props) => {
  return (
    <div className="py-40 h-screen flex flex-col justify-center items-center gap-10">
      <FaTruck className="fill-secondary" size={50} />
      <p className="max-w-2xl text-center italic">
        {message}
      </p>
    </div>
  )
}

export default NoEntries