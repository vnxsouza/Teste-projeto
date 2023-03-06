/* eslint-disable import-helpers/order-imports */
import React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Link } from 'react-router-dom'
import './ModalMessage.css'
import { IoIosCloseCircle } from 'react-icons/io'
import { BsFillCheckCircleFill } from 'react-icons/bs'

interface ModalMessageProps {
  readonly title: any[]
  readonly text?: string
  readonly className?: string
  readonly textbutton: string
  readonly textbutton2?: string
  readonly show: boolean
  readonly onHide: () => void
}

function ModalMessage({ title, text, show, className, textbutton, textbutton2, onHide, ...rest }: ModalMessageProps) {
  return (
    <div className="modal">
      <Modal
        {...rest}
        show={show}
        dialogClassName={className}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <div className="modalHeader">
            <IoIosCloseCircle
              size={35}
              color="rgb(240, 88, 88)"
              className={`iconError ${title.length === 1 ? 'col-1' : 'col-2'}`}
            />
            <BsFillCheckCircleFill
              size={35}
              color="#6a9c5e"
              className={`iconSuccess ${title.length === 1 ? 'col-1' : 'col-2'}`}
            />
            <h4 className={`titleHeader ${title.length === 1 ? 'col-11' : 'col-10'}`}>
              {title.length === 1
                ? title.toString()
                : title.map((titulo) => (
                    <li key={titulo} className="listaErros">
                      {`- ${titulo}`}
                    </li>
                  ))}
            </h4>
          </div>

          <div className="modalBody">
            <p>{text}</p>
          </div>

          <div className="buttonCloseModal">
            <Link to="/digitalizacao" className="buttonOpcional">
              <Button onClick={onHide}>{textbutton2}</Button>
            </Link>
            <Button onClick={onHide}>{textbutton}</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ModalMessage
