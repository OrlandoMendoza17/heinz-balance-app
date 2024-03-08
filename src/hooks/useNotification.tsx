import { MouseEventHandler, useState } from "react"

export type NotificationProps = {
  show: boolean,
  type: "success" | "warning" | "danger",
  title: string,
  message: string,
}

export type HandleNotification = {
  open: (notification: OpenProps) => void;
  close: () => void;
}

export type OpenProps = Omit<NotificationProps, "show">

const useNotification = (): [NotificationProps, HandleNotification] => {

  const [timeoutID, setTimeoutID] = useState<NodeJS.Timeout>()

  const [notification, setNotification] = useState<NotificationProps>({
    show: false,
    type: "warning",
    title: "Notification",
    message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem, voluptates!",
  })

  const handleNotification: HandleNotification = {
    open: (notification: OpenProps): void => {
      setNotification({ ...notification, show: true })
      
      clearTimeout(timeoutID)
      setTimeoutID(setTimeout(() => handleNotification.close(), 20000))
      
    },
    close: () => {
      setNotification({ ...notification, show: false })
    },
  }

  return [notification, handleNotification]
}

export default useNotification;