import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalInativacaoUsuarioProps {
  readonly nome?: string
  readonly show: boolean
  readonly username: string
  readonly id: string
  readonly textbutton: string
  readonly textbutton2: string
  readonly onHide: () => void
  readonly onClick: () => void
}

function ModalInativacaoUsuario({
  nome,
  username,
  show,
  id,
  textbutton,
  textbutton2,
  onClick,
  onHide,
  ...rest
}: ModalInativacaoUsuarioProps) {
  const { atualizaUsuarios } = useContext(DadosContext)

  const [successEditUsuario, setSuccessEditUsuario] = useState(false)
  const [modalSuccessEditUsuarioShow, setModalSuccessEditUsuarioShow] = useState(false)
  const [messageSuccessEditUsuario, setMessageSuccessEditUsuario] = useState('')
  const [falhaEditUsuario, setFalhaEditUsuario] = useState(false)
  const [modalFalhaEditUsuarioShow, setModalFalhaEditUsuarioShow] = useState(false)
  const [messageFalhaEditUsuario, setMessageFalhaEditUsuario] = useState('')

  async function inativaUsuario() {
    try {
      const response = await api.put(`Account/inativa-usuario?usuarioId=${id}`)
      setMessageSuccessEditUsuario(response.data.message)
      setSuccessEditUsuario(true)
      setModalSuccessEditUsuarioShow(true)
      atualizaUsuarios()
    } catch (error: any) {
      setMessageFalhaEditUsuario(error.response.data.message)
      setFalhaEditUsuario(true)
      setModalFalhaEditUsuarioShow(true)
    }
  }

  return (
    <>
      {!successEditUsuario && !falhaEditUsuario && (
        <Modal
          {...rest}
          show={show}
          dialogClassName="modalMedio"
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <div className="modalBodyInativacao">
              <h4>Deseja inativar o usuário {username}?</h4>
            </div>

            <div className="buttonsModalInative">
              <Button onClick={inativaUsuario} variant="none" className="buttonInative">
                {textbutton}
              </Button>

              <Button onClick={onHide} variant="none" className="buttonBackAndCancel">
                {textbutton2}
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {successEditUsuario && (
        <ModalMessage
          title={[messageSuccessEditUsuario]}
          className="modalSuccess"
          show={modalSuccessEditUsuarioShow}
          onHide={() => [setModalSuccessEditUsuarioShow(false), onClick()]}
          textbutton="OK"
        />
      )}

      {falhaEditUsuario && (
        <ModalMessage
          title={[messageFalhaEditUsuario]}
          className="modalFalha"
          show={modalFalhaEditUsuarioShow}
          onHide={() => [setModalFalhaEditUsuarioShow(false), onClick()]}
          textbutton="OK"
        />
      )}
    </>
  )
}

export default ModalInativacaoUsuario
