import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalInativacaoCorporacaoProps {
  readonly nome: string
  readonly show: boolean
  readonly id: string
  readonly textbutton: string
  readonly textbutton2: string
  readonly onHide: () => void
  readonly onClick: () => void
}

function ModalInativacaoCorporacao({
  nome,
  show,
  id,
  textbutton,
  textbutton2,
  onClick,
  onHide,
  ...rest
}: ModalInativacaoCorporacaoProps) {
  const { atualizaCorporacao } = useContext(DadosContext)

  const [successEditCorporacao, setSuccessEditCorporacao] = useState(false)
  const [modalSuccessEditCorporacaoShow, setModalSuccessEditCorporacaoShow] = useState(false)
  const [messageSuccessEditCorporacao, setMessageSuccessEditCorporacao] = useState('')
  const [falhaEditCorporacao, setFalhaEditCorporacao] = useState(false)
  const [modalFalhaEditCorporacaoShow, setModalFalhaEditCorporacaoShow] = useState(false)
  const [messageFalhaEditCorporacao, setMessageFalhaEditCorporacao] = useState('')

  async function inativaCorporacao() {
    try {
      const response = await api.put(`Corporacao/inativa-corporacao?corporacaoId=${id}`)
      setMessageSuccessEditCorporacao(response.data.message)
      setSuccessEditCorporacao(true)
      setModalSuccessEditCorporacaoShow(true)
      atualizaCorporacao()
    } catch (error: any) {
      setMessageFalhaEditCorporacao(error.response.data.message)
      setFalhaEditCorporacao(true)
      setModalFalhaEditCorporacaoShow(true)
    }
  }

  return (
    <>
      {!successEditCorporacao && !falhaEditCorporacao && (
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
              <h4>Deseja inativar a corporação {nome}?</h4>
            </div>

            <div className="buttonsModalInative">
              <Button onClick={inativaCorporacao} variant="none" className="buttonInative">
                {textbutton}
              </Button>

              <Button onClick={onHide} variant="none" className="buttonBackAndCancel">
                {textbutton2}
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {successEditCorporacao && (
        <ModalMessage
          title={[messageSuccessEditCorporacao]}
          className="modalSuccess"
          show={modalSuccessEditCorporacaoShow}
          onHide={() => [setModalSuccessEditCorporacaoShow(false), onClick()]}
          textbutton="OK"
        />
      )}

      {falhaEditCorporacao && (
        <ModalMessage
          title={[messageFalhaEditCorporacao]}
          className="modalFalha"
          show={modalFalhaEditCorporacaoShow}
          onHide={() => [setModalFalhaEditCorporacaoShow(false), onClick()]}
          textbutton="OK"
        />
      )}
    </>
  )
}

export default ModalInativacaoCorporacao
