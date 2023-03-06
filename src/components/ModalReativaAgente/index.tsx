import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalReativacaoAgenteProps {
  readonly nome: string
  readonly id: string
  readonly show: boolean
  readonly className?: string
  readonly textbutton: string
  readonly textbutton2: string
  readonly onHide: () => void
  readonly onClick: () => void
}

function ModalReativacaoAgente({
  nome,
  id,
  className,
  show,
  textbutton,
  textbutton2,
  onClick,
  onHide,
  ...rest
}: ModalReativacaoAgenteProps) {
  const { atualizaAgentes } = useContext(DadosContext)

  const [successEditAgente, setSuccessEditAgente] = useState(false)
  const [modalSuccessEditAgenteShow, setModalSuccessEditAgenteShow] = useState(false)
  const [messageSuccessEditAgente, setMessageSuccessEditAgente] = useState('')
  const [falhaEditAgente, setFalhaEditAgente] = useState(false)
  const [modalFalhaEditAgenteShow, setModalFalhaEditAgenteShow] = useState(false)
  const [messageFalhaEditAgente, setMessageFalhaEditAgente] = useState('')

  async function reativaAgente() {
    try {
      const response = await api.put(`Agente/reativa-agente?agenteId=${id}`)
      setMessageSuccessEditAgente(response.data.message)
      setSuccessEditAgente(true)
      setModalSuccessEditAgenteShow(true)
      atualizaAgentes()
    } catch (error: any) {
      setMessageFalhaEditAgente(error.response.data.message)
      setFalhaEditAgente(true)
      setModalFalhaEditAgenteShow(true)
    }
  }

  return (
    <>
      {!successEditAgente && !falhaEditAgente && (
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
              <h4>Deseja reativar o agente {nome}?</h4>
            </div>

            <div className="buttonsModalEdit">
              <Button onClick={reativaAgente} variant="none" className="buttonSave">
                {textbutton}
              </Button>

              <Button onClick={onHide} variant="none" className="buttonBackAndCancel">
                {textbutton2}
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {successEditAgente && (
        <ModalMessage
          title={[messageSuccessEditAgente]}
          className="modalSuccess"
          show={modalSuccessEditAgenteShow}
          onHide={() => [setModalSuccessEditAgenteShow(false), onClick()]}
          textbutton="OK"
        />
      )}

      {falhaEditAgente && (
        <ModalMessage
          title={[messageFalhaEditAgente]}
          className="modalFalha"
          show={modalFalhaEditAgenteShow}
          onHide={() => [setModalFalhaEditAgenteShow(false), onClick()]}
          textbutton="OK"
        />
      )}
    </>
  )
}

export default ModalReativacaoAgente
