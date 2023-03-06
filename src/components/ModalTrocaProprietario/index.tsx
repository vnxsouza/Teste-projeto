import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import { AuthContext } from '../../contexts/AuthContext'
import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalTrocaProprietarioProps {
  readonly numero: number
  readonly nome: string
  readonly cpf: string
  readonly textbutton: string
  readonly textbutton2: string
  readonly show: boolean
  readonly onHide: () => void
}

function ModalTrocaProprietario({
  numero,
  nome,
  cpf,
  textbutton,
  textbutton2,
  show,
  onHide,
  ...rest
}: ModalTrocaProprietarioProps) {
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

  const optionsProprietarios = [
    {
      value: 1,
      label: 'DEVANIR APARECIDA DA SILVA'
    },
    {
      value: 2,
      label: 'Juliana Nunes'
    },
    {
      value: 3,
      label: 'Marcos Fernandes'
    }
  ]

  const [novoProprietario, setNovoProprietario] = useState([])

  // const formAtualizaAgente = () => {

  //     const dadosAtualizaAgente = {
  //         "id": props.id,
  //         "clienteId": Number(clienteCode),
  //         "corporacaoId": props.corporacao,
  //         "nome": nomeEditadoAgente,
  //         "cpf": cpfEditadoAgente,
  //         "numero": numeroEditadoAgente
  //     }

  //     api.put("Agente/atualiza-agente", dadosAtualizaAgente)

  //         .then((response) => {
  //             if (response.status === 200) {
  //                 setMessageSuccessEditAgente(response.data.message)
  //                 setSuccessEditAgente(true)
  //                 setModalSuccessEditAgenteShow(true)
  //                 atualizaAgentes()
  //             }
  //         })
  //         .catch((error) => {
  //             if (error.response.status === 400 | error.response.status === 500) {
  //                 setMessageFalhaEditAgente(error.response.data.message)
  //                 setFalhaEditAgente(true)
  //                 setModalFalhaEditAgenteShow(true)
  //             }
  //         });
  // }

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
              <h4>Trocar proprietário</h4>
            </div>

            <div className="bodyModalEdit">
              <form className="formEdicaoAgente">
                <div className="editaAgente">
                  <div className="labelForm col-11 col-md-12 mb-4">
                    <Select
                      className=" selectTipoInfracao col-12"
                      name="selectProprietario"
                      id="selectProprietario"
                      value={novoProprietario}
                      placeholder="Proprietário"
                      options={optionsProprietarios}
                      //   onChange={(item) => setSelectedOptionsInfracao(item)}
                      //   onBlur={(dado) => sendValuesOptionsInfracao(dado)}
                      required
                    />
                  </div>
                </div>

                <div className="buttonsModalEdit">
                  {/* <ButtonSubmit text={'Salvar'} onClick={handleSubmit(formAtualizaAgente)}></ButtonSubmit> */}
                  <Button type="submit" onClick={onHide} variant="none" className="buttonSave">
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
          className="modalEditaAgente"
          show={modalSuccessEditAgenteShow}
          onHide={() => setModalSuccessEditAgenteShow(false)}
          textbutton="OK"
        />
      )}

      {falhaEditAgente && (
        <ModalMessage
          title={[messageFalhaEditAgente]}
          className="modalFalhaCriaAgente"
          show={modalFalhaEditAgenteShow}
          onHide={() => setModalFalhaEditAgenteShow(false)}
          textbutton="OK"
        />
      )}
    </>
  )
}

export default ModalTrocaProprietario
