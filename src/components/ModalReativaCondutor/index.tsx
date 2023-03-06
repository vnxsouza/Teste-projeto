import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalReativacaoCondutorProps {
  readonly nome: string
  readonly id: string
  readonly show: boolean
  readonly className?: string
  readonly textbutton: string
  readonly textbutton2: string
  readonly onHide: () => void
  readonly onClick: () => void
}

function ModalReativacaoCondutor({
  nome,
  id,
  className,
  show,
  textbutton,
  textbutton2,
  onClick,
  onHide,
  ...rest
}: ModalReativacaoCondutorProps) {
  const { atualizaCondutores } = useContext(DadosContext)

  const [successEditCondutor, setSuccessEditCondutor] = useState(false)
  const [modalSuccessEditCondutorShow, setModalSuccessEditCondutorShow] = useState(false)
  const [messageSuccessEditCondutor, setMessageSuccessEditCondutor] = useState('')
  const [falhaEditCondutor, setFalhaEditCondutor] = useState(false)
  const [modalFalhaEditCondutorShow, setModalFalhaEditCondutorShow] = useState(false)
  const [messageFalhaEditCondutor, setMessageFalhaEditCondutor] = useState('')

  async function reativaCondutor() {
    try {
      const response = await api.put(`Condutor/reativa-Condutor?CondutorId=${id}`)
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
              <h4>Deseja reativar o Condutor {nome}?</h4>
            </div>

            <div className="buttonsModalEdit">
              <Button onClick={reativaCondutor} variant="none" className="buttonSave">
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

export default ModalReativacaoCondutor
