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
  closeOnClickOutside?: boolean,
}

const Modal = (props: Props) => {
  const { showModal, setModal, children , closeButton = true } = props
  const { transparent = false, className = "", targetModal = "modal", closeOnClickOutside = true  } = props

  const handleClick: MouseEventHandler<HTMLDivElement> = ({ target }) => {
    if(closeOnClickOutside){
      const clickedOutModal = getDataAttribute(target as TargetProps, targetModal.toLowerCase())
      if (clickedOutModal) {
        setModal(false)
      }
    }
  }

  return (
    showModal ?
      <Portal type="modal">
        <div
          onClick={handleClick}
          {...{ [`data-${targetModal}`]: true }}
          className={`Modal snap-y ${className}`}
        >
          <div className={`Modal_container scroll-pb-11 ${transparent && "transparent"}`}>
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