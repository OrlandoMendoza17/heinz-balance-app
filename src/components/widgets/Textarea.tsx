import React, { TextareaHTMLAttributes } from 'react'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string,
  title?: string,
  titleStyle?: string,
}

const Textarea = (props: Omit<Props, "name">): JSX.Element => {
  const { id, title = "", titleStyle = "", className = "", required = true, ...inputProps } = props

  return (
    <label htmlFor={id} className={`Input ${className}`}>
      {
        title &&
        <span className={titleStyle}>
          {title}
        </span>
      }
      <textarea id={id} name={id} className="!transition-none" required={required} {...inputProps} />
    </label>
  )
}

export default Textarea;