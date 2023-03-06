import React from 'react'
import './ButtonSubmit.css'

interface ButtonSubmitProps {
  readonly text: string
  readonly type?: 'submit' | 'button' | 'reset'
  readonly onClick?: () => void
}

function ButtonSubmit({ text, type = 'submit', onClick }: ButtonSubmitProps) {
  return (
    <div className="buttonSubmit">
      <button type={type} className="btn btn-primary" onClick={onClick}>
        {text}
      </button>
    </div>
  )
}

export default ButtonSubmit
