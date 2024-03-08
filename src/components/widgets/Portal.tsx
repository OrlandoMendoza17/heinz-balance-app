import React, { useState, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom';


type Props = {
  type: "modal" | "alert",
  children: ReactNode | JSX.Element,
}

type RootElement = HTMLElement | Element | DocumentFragment | null

const Portal = ({ type, children }: Props) => {
  
  const [mounted, setMounted] = useState<boolean>(false)
  // const [element, setElement] = useState<RootElement>()

  useEffect(() => {
    setMounted(true)
  }, [])

  const rootElement = (mounted ? document.getElementById(type) : <div></div>) as Element | DocumentFragment 
  // console.log('rootElement', rootElement)
  
  return (
    mounted ?
      createPortal(
        <>
          {children}
        </>,
        rootElement
      )
      :
      <></>
  )
}

export default Portal;