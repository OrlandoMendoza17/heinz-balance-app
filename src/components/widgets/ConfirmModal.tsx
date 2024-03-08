import { HandleNotification, NotificationProps, OpenProps } from '@/hooks/useNotification'
import React, { MouseEventHandler } from 'react'
import Portal from './Portal'

type TargetProps = EventTarget & HTMLElement

interface Props {
  notificationProps: [NotificationProps, HandleNotification],
  button1?: boolean,
  button2?: boolean,
  acceptAction: () => void,
}

const LOREM = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, amet!"

const ConfirmModal = (props: Props) => {

  const { acceptAction, notificationProps, button1 = true, button2 = true } = props
  const [notification, handleNotification] = notificationProps
  
  const { title = "Title", message = LOREM } = notification

  const handleClick: MouseEventHandler<HTMLDivElement> = ({ target, currentTarget }) => {
    const getDataAttribute = (target: TargetProps, attribute: string): boolean => {
      const boolean = ["true", "false"]

      const data = target.dataset[attribute];

      if (typeof data === "string") {
        const isBoolean = boolean.includes(data);
        return isBoolean ? JSON.parse(data) : data
      }

      return false;
    }

    const clickedOutModal = getDataAttribute(target as TargetProps, "modal")
    console.log('clickedOutModal', clickedOutModal)

    if (clickedOutModal) handleNotification.close()
  }

  const handleAccept = () => {
    acceptAction()
    handleNotification.close();
  }

  return (
    <Portal type="modal">
      {
        notification.show &&
        <div data-modal={true} onClick={handleClick} className="ConfirmModal">
          <div className="ConfirmModal__main-container">

            <div className="content">
              <span className="text-5xl">⚠</span>
              <h1 className="pt-8 text-2xl font-bold text-gray-500">{title}</h1>
              <p className="my-4 text-lg text-gray-500">{message}</p>
            </div>

            <div className={`buttons-container ${(button1 && button2) ? "two-buttons" : ""}`}>
              {
                button1 &&
                <button onClick={handleAccept} className="bg-green-500 duration-75 hover:bg-green-400">
                  Aceptar
                </button>
              }
              {
                button2 &&
                <button onClick={handleNotification.close} className="bg-red-500 duration-75 hover:bg-red-400">
                  Cerrar
                </button>
              }
            </div>
          </div>
        </div>
      }
    </Portal>
  )
}

export default ConfirmModal