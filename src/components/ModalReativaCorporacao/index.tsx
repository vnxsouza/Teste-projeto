import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalReativacaoCorporacaoProps {
  readonly nome: string
  readonly show: boolean
  readonly className?: string
  readonly id: string
  readonly textbutton: string
  readonly textbutton2: string
  readonly onHide: () => void
  readonly onClick: () => void
}

function ModalReativacaoCorporacao({
  nome,
  id,
  className,
  textbutton,
  show,
  textbutton2,
  onClick,
  onHide,
  ...rest
}: ModalReativacaoCorporacaoProps) {
  const { atualizaCorporacao } = useContext(DadosContext)

  const [successEditAgente, setSuccessEditAgente] = useState(false)
  const [modalSuccessEditAgenteShow, setModalSuccessEditAgenteShow] = useState(false)
  const [messageSuccessEditAgente, setMessageSuccessEditAgente] = useState('')
  const [falhaEditAgente, setFalhaEditAgente] = useState(false)
  const [modalFalhaEditAgenteShow, setModalFalhaEditAgenteShow] = useState(false)
  const [messageFalhaEditAgente, setMessageFalhaEditAgente] = useState('')

  async function reativaCorporacao() {
    try {
      const response = await api.put(`Corporacao/reativa-corporacao?corporacaoId=${id}`)
      setMessageSuccessEditAgente(response.data.message)
      setSuccessEditAgente(true)
      setModalSuccessEditAgenteShow(true)
      atualizaCorporacao()
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
              <h4>Deseja reativar a corporação {nome}?</h4>
            </div>

            <div className="buttonsModalEdit">
              <Button onClick={reativaCorporacao} variant="none" className="buttonSave">
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

export default ModalReativacaoCorporacao
