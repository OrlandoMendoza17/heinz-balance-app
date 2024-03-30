import React, { ReactNode, Dispatch, SetStateAction, MouseEventHandler } from 'react'
import Portal from './Portal'
import getDataAttribute, { TargetProps } from '@/utils/getDataAttribute'
import { FaXmark } from 'react-icons/fa6'

type Props = {
  showModal: boolean,
  setModal: Dispatch<SetStateAction<boolean>>,
  closeButton?: boolean,
  transparent?: boolean,
  children: ReactNode,
  targetModal?: string,
  className?: string,
}

const Modal = ({ showModal, setModal, closeButton = true, transparent = false, className = "", targetModal = "modal", children }: Props) => {

  const handleClick: MouseEventHandler<HTMLDivElement> = ({ target }) => {
    const clickedOutModal = getDataAttribute(target as TargetProps, targetModal.toLowerCase())
    debugger
    if (clickedOutModal) {
      setModal(false)
    }
  }

  return (
    showModal ?
      <Portal type="modal">
        <div
          onClick={handleClick}
          {...{ [`data-${targetModal}`]: true }}
          className={`Modal ${className}`}
        >
          <div className={`Modal_container ${transparent && "transparent"}`}>
            {
              closeButton &&
              <button className="close_btn" onClick={() => setModal(false)}>
                <FaXmark className="fill-black w-6 h-6" />
              </button>
            }
            {
              children
            }
          </div>
        </div>
      </Portal>
      :
      <></>
  )
}

export default Modal