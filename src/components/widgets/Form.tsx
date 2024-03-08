import React, { useRef, FormHTMLAttributes } from 'react'

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode | JSX.Element[] | JSX.Element,
  onInvalid?: () => void,
}

const Form = ({ children, onInvalid, ...formProps }: Props) => {

  const $form = useRef<HTMLFormElement>(null)
  
  const handleInvalid = () =>{
    console.log("Invalid from Component")
    console.log($form.current)
    $form.current?.classList.add("validated")
    
    if(onInvalid) onInvalid()
  }
  
  return (
    <form ref={$form} onInvalid={handleInvalid} {...formProps}>
      {children}
    </form>
  )
}

export default Form