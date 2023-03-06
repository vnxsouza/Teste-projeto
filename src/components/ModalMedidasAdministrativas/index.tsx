import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useForm } from 'react-hook-form'

import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import './ModalMedidasAdministrativas.css'

interface ModalMedidasAdministrativasProps {
  readonly nome?: string
  readonly show: boolean
  readonly textbutton: string
  readonly textbutton2?: string
  readonly onHide: () => void
}

function ModalMedidasAdministrativas({
  nome,
  show,
  textbutton,
  textbutton2,
  onHide,
  ...rest
}: ModalMedidasAdministrativasProps) {
  const {
    medidasAdministrativas,
    setModalMedidasAdministrativas,
    submitForm,
    setMessageSuccess,
    idInfracao,
    messageMedidasAdmin,
    setMessageFalha,
    setFalha,
    setModalFalhaShow
  } = useContext(DadosContext)

  const { handleSubmit } = useForm()

  const [medidasAdminSelecionadas, setMedidasAdminSelecionadas] = useState([])

  const infracaoComMedidasAdmin = () => {
    const postMedidasAdmin = {
      infracaoId: idInfracao,
      medidasAdministrativasId: medidasAdminSelecionadas
    }

    api
      .post('Infracao/medida-administrativa', postMedidasAdmin)
      .then((response) => {
        if (response.status === 200) {
          setModalMedidasAdministrativas(false)
          setMessageSuccess(response.data.message)
          submitForm()
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          setMessageFalha(error.response.data.message)
          setFalha(true)
          setModalFalhaShow(true)
        }
      })
  }

  return (
    <Modal
      {...rest}
      show={show}
      dialogClassName="modalMedio"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="modalBodyMedidasAdmin">
          <h4>{messageMedidasAdmin}</h4>
          <form onSubmit={handleSubmit(infracaoComMedidasAdmin)}>
            {medidasAdministrativas.map((dado) => (
              <div className="checkboxMedidasAdmin" key={dado.id}>
                <label>
                  <input
                    type="checkbox"
                    value={dado.id}
                    onChange={(e) => setMedidasAdminSelecionadas([...medidasAdminSelecionadas, Number(e.target.value)])}
                  />
                  {` ${dado.descricao}`}
                </label>
              </div>
            ))}

            <div className="buttonsModalMedidasAdmin mt-2">
              <Button
                type="submit"
                variant="none"
                onClick={handleSubmit(infracaoComMedidasAdmin)}
                className="buttonEnviaComMedidasAdmin"
              >
                {textbutton}
              </Button>

              <Button onClick={onHide} variant="none" className="buttonEnviaSemMedidasAdmin">
                {textbutton2}
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ModalMedidasAdministrativas
