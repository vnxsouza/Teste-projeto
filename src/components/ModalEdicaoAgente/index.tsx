import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useForm } from 'react-hook-form'

import { AuthContext } from '../../contexts/AuthContext'
import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalEdicaoAgenteProps {
  readonly numero: number
  readonly nome: string
  readonly show: boolean
  readonly cpf: string
  readonly id: string
  readonly corporacao: string
  readonly textbutton: string
  readonly textbutton2: string
  readonly onHide: () => void
  readonly onClick: () => void
}

function ModalEdicaoAgente({
  corporacao,
  cpf,
  id,
  nome,
  numero,
  show,
  textbutton,
  textbutton2,
  onClick,
  onHide,
  ...rest
}: ModalEdicaoAgenteProps) {
  const [numeroEditadoAgente, setNumeroEditadoAgente] = useState(numero)
  const [nomeEditadoAgente, setNomeEditadoAgente] = useState(nome)
  const [cpfEditadoAgente, setCpfEditadoAgente] = useState(cpf)

  const [successEditAgente, setSuccessEditAgente] = useState(false)
  const [modalSuccessEditAgenteShow, setModalSuccessEditAgenteShow] = useState(false)
  const [messageSuccessEditAgente, setMessageSuccessEditAgente] = useState('')
  const [falhaEditAgente, setFalhaEditAgente] = useState(false)
  const [modalFalhaEditAgenteShow, setModalFalhaEditAgenteShow] = useState(false)
  const [messageFalhaEditAgente, setMessageFalhaEditAgente] = useState('')

  const { Corporacao, atualizaAgentes } = useContext(DadosContext)
  const { clienteCode } = useContext(AuthContext)

  const { register, handleSubmit } = useForm()

  const formAtualizaAgente = () => {
    const dadosAtualizaAgente = {
      id,
      clienteId: Number(clienteCode),
      corporacaoId: corporacao,
      nome: nomeEditadoAgente,
      cpf: cpfEditadoAgente,
      numero: numeroEditadoAgente
    }

    api
      .put('Agente/atualiza-agente', dadosAtualizaAgente)

      .then((response) => {
        if (response.status === 200) {
          setMessageSuccessEditAgente(response.data.message)
          setSuccessEditAgente(true)
          setModalSuccessEditAgenteShow(true)
          atualizaAgentes()
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          setMessageFalhaEditAgente(error.response.data.message)
          setFalhaEditAgente(true)
          setModalFalhaEditAgenteShow(true)
        }
      })
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
            <div className="headerModalEdit">
              <h4>Editar agente</h4>
            </div>

            <div className="bodyModalEdit">
              <form className="formEdicaoAgente" onSubmit={handleSubmit(formAtualizaAgente)}>
                <div className="editaAgente">
                  <div className="labelForm col-3">
                    <input
                      type="text"
                      name="numeroAgenteEdicao"
                      placeholder="N°"
                      className="form-control"
                      id="buscaAgente"
                      value={numeroEditadoAgente}
                      onChange={(e) => setNumeroEditadoAgente(Number(e.target.value))}
                      readOnly
                    />
                    <label>N°</label>
                  </div>

                  <div className="labelForm col-8">
                    <input
                      type="text"
                      name="nomeEdicaoAgente"
                      placeholder="Nome"
                      className="form-control"
                      id="nomeEdicaoAgente"
                      value={nomeEditadoAgente}
                      onChange={(e) => setNomeEditadoAgente(e.target.value)}
                    />
                    <label>Nome</label>
                  </div>

                  <div className="labelForm col-11 col-md-4">
                    <input
                      type="text"
                      name="cpfEdicaoAgente"
                      placeholder="CPF"
                      className="form-control"
                      id="cpfEdicaoAgente"
                      value={cpfEditadoAgente}
                      onChange={(e) => setCpfEditadoAgente(e.target.value)}
                      readOnly
                    />
                    <label>CPF</label>
                  </div>

                  <div className="labelForm col-11 col-md-7">
                    <select
                      name="corporacaoEdicaoAgente"
                      className="col-12"
                      disabled
                      defaultValue={corporacao}
                      {...register('corporacaoEdicaoAgente')}
                    >
                      <option disabled>SELECIONE A CORPORAÇÃO</option>
                      {Corporacao.map((dado) => (
                        <option key={dado.id} value={dado.id}>
                          {dado.descricao}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="buttonsModalEdit">
                  {/* <ButtonSubmit text={'Salvar'} onClick={handleSubmit(formAtualizaAgente)}></ButtonSubmit> */}
                  <Button
                    type="submit"
                    onClick={handleSubmit(formAtualizaAgente)}
                    variant="none"
                    className="buttonSave"
                  >
                    {textbutton}
                  </Button>
                  <Button onClick={onHide} variant="none" className="buttonCancel">
                    {textbutton2}
                  </Button>
                </div>
              </form>
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

export default ModalEdicaoAgente
