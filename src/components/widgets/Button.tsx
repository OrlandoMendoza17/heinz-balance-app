import React, { ReactNode, ButtonHTMLAttributes} from 'react'
import Spinner from './Spinner'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "danger" | "warning" | "success" | "info" | "gray" | "primary" | "secondary" ,
  loading?: boolean,
  noSpinner?: boolean,
  children: ReactNode | JSX.Element[] | JSX.Element,
}

const bg_type = {
  danger: `bg-red-600 hover:bg-red-500 active:bg-red-700`,
  warning: `bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700`,
  success: `bg-green-600 hover:bg-green-500 active:bg-green-700`,
  info: `bg-blue-600 hover:bg-blue-500 active:bg-blue-700`,
  gray: "bg-slate-400 hover:bg-slate-300 active:bg-slate-500",
  primary: `bg-primary hover:bg-red-500 active:bg-red-700`,
  secondary: "bg-secondary hover:bg-blue-500 active:bg-blue-700 ",
}

const Button = (props: Props) => {

  const { color, loading = false, type = "button", noSpinner = false, className, children, ...buttonProps } = props

  const spinner = noSpinner ? children : <Spinner text size="small" />

  return (
    <button
      type={type}
      disabled={loading}
      className={`Button ${color ? bg_type[color] : ""} ${className}`}
      {...buttonProps}
    >
      {
        !loading ? children : spinner
      }
    </button>
  )
}
export default Button;