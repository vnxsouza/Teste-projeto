import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalInativacaoCondutorProps {
  readonly nome: string
  readonly show: boolean
  readonly id: number
  readonly textbutton: string
  readonly textbutton2: string
  readonly onHide: () => void
  readonly onClick: () => void
}

function ModalInativacaoCondutor({
  nome,
  show,
  id,
  textbutton,
  textbutton2,
  onClick,
  onHide,
  ...rest
}: ModalInativacaoCondutorProps) {
  const { atualizaCondutores } = useContext(DadosContext)

  const [successEditCondutor, setSuccessEditCondutor] = useState(false)
  const [modalSuccessEditCondutorShow, setModalSuccessEditCondutorShow] = useState(false)
  const [messageSuccessEditCondutor, setMessageSuccessEditCondutor] = useState('')
  const [falhaEditCondutor, setFalhaEditCondutor] = useState(false)
  const [modalFalhaEditCondutorShow, setModalFalhaEditCondutorShow] = useState(false)
  const [messageFalhaEditCondutor, setMessageFalhaEditCondutor] = useState('')

  async function inativaCondutor() {
    try {
      const response = await api.put(`Condutor/inativa-condutor?condutorId=${id}`)
      setMessageSuccessEditCondutor(response.data.message)
      setSuccessEditCondutor(true)
      setModalSuccessEditCondutorShow(true)
      atualizaCondutores()
    } catch (error: any) {
      setMessageFalhaEditCondutor(error.response.data.message)
      setFalhaEditCondutor(true)
      setModalFalhaEditCondutorShow(true)
    }
  }

  return (
    <>
      {!successEditCondutor && !falhaEditCondutor && (
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
              <h4>Deseja inativar o condutor {nome}?</h4>
            </div>

            <div className="buttonsModalInative">
              <Button onClick={inativaCondutor} variant="none" className="buttonInative">
                {textbutton}
              </Button>

              <Button onClick={onHide} variant="none" className="buttonBackAndCancel">
                {textbutton2}
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {successEditCondutor && (
        <ModalMessage
          title={[messageSuccessEditCondutor]}
          className="modalSuccess"
          show={modalSuccessEditCondutorShow}
          onHide={() => [setModalSuccessEditCondutorShow(false), onClick()]}
          textbutton="OK"
        />
      )}

      {falhaEditCondutor && (
        <ModalMessage
          title={[messageFalhaEditCondutor]}
          className="modalFalha"
          show={modalFalhaEditCondutorShow}
          onHide={() => [setModalFalhaEditCondutorShow(false), onClick()]}
          textbutton="OK"
        />
      )}
    </>
  )
}

export default ModalInativacaoCondutor
