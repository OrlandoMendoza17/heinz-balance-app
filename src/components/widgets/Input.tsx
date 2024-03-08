import React, { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string,
  title?: string,
  titleStyle?: string,
}

const Input = (props: Omit<Props, "name">): JSX.Element => {
  const { id, title = "", titleStyle = "", className = "", type = "text", required = true, ...inputProps } = props

  return (
    <label htmlFor={id} className={`Input ${className}`}>
      {
        title &&
        <span className={titleStyle}>
          {title}
        </span>
      }
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        {...inputProps}
      />
    </label>
  )
}

export default Input;