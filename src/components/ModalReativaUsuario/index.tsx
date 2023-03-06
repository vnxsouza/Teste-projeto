import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalReativacaoUsuarioProps {
  readonly username: string
  readonly className?: string
  readonly show: boolean
  readonly id: string
  readonly textbutton: string
  readonly textbutton2: string
  readonly onHide: () => void
  readonly onClick: () => void
}

function ModalReativacaoUsuario({
  username,
  id,
  show,
  textbutton,
  textbutton2,
  onClick,
  onHide,
  ...rest
}: ModalReativacaoUsuarioProps) {
  const { atualizaUsuarios } = useContext(DadosContext)

  const [successEditUsuario, setSuccessEditUsuario] = useState(false)
  const [modalSuccessEditUsuarioShow, setModalSuccessEditUsuarioShow] = useState(false)
  const [messageSuccessEditUsuario, setMessageSuccessEditUsuario] = useState('')
  const [falhaEditUsuario, setFalhaEditUsuario] = useState(false)
  const [modalFalhaEditUsuarioShow, setModalFalhaEditUsuarioShow] = useState(false)
  const [messageFalhaEditUsuario, setMessageFalhaEditUsuario] = useState('')

  async function reativaUsuario() {
    try {
      const response = await api.put(`Account/reativa-usuario?usuarioId=${id}`)
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
              <h4>Deseja reativar o usuário {username}?</h4>
            </div>

            <div className="buttonsModalEdit">
              <Button onClick={reativaUsuario} variant="none" className="buttonSave">
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

export default ModalReativacaoUsuario
