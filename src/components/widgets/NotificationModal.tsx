import React, { MouseEventHandler } from 'react'
import Portal from './Portal'
import { FaXmark } from 'react-icons/fa6';
import { HandleNotification, NotificationProps } from '@/hooks/useNotification';

// type Props = {
//   show: boolean,
//   type: "success" | "warning" | "danger",
//   title: string,
//   message: string,
//   notification: 
//   closeNotification: MouseEventHandler<HTMLButtonElement>
// }

type Props = {
  alertProps: [NotificationProps, HandleNotification],
}

// { notification, handleNotification }: Props

const NotificationModal = ({ alertProps: [notification, handleNotification] }: Props) => {

  const { show, type, title = "", message } = notification

  const states = {
    success: "modal_green",
    warning: "modal_yellow",
    danger: "modal_red",
  }

  const modalState = type ? states[type] : ""

  return (
    <Portal type="alert">
      {
        show &&
        <div className={`NotificationModal ${modalState}`}>

          <div>
            <span>{title}</span>
            <span>{message}</span>
          </div>

          <button onClick={handleNotification.close}>
            <FaXmark />
          </button>

        </div>
      }
    </Portal>
  )
}

export default NotificationModal;