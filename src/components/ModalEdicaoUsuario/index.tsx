/* eslint-disable react/jsx-boolean-value */
import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useForm } from 'react-hook-form'

import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalEdicaoUsuarioProps {
  readonly primeironome: string
  readonly ultimonome: string
  readonly username: string
  readonly show: boolean
  readonly email: string
  readonly id: string
  readonly textbutton: string
  readonly textbutton2: string
  readonly onHide: () => void
  readonly onClick: () => void
}

function ModalEdicaoUsuario({
  primeironome,
  ultimonome,
  show,
  username,
  email,
  id,
  textbutton,
  textbutton2,
  onClick,
  onHide,
  ...rest
}: ModalEdicaoUsuarioProps) {
  const [primeiroNomeEditadoUsuario, setPrimeiroNomeEditadoUsuario] = useState(primeironome)
  const [ultimoNomeEditadoUsuario, setUltimoNomeEditadoUsuario] = useState(ultimonome)
  const [userNameEditadoUsuario, setUserNameEditadoUsuario] = useState(username)
  const [emailEditadoUsuario, setEmailEditadoUsuario] = useState(email)

  const [successEditUsuario, setSuccessEditUsuario] = useState(false)
  const [modalSuccessEditUsuarioShow, setModalSuccessEditUsuarioShow] = useState(false)
  const [messageSuccessEditUsuario, setMessageSuccessEditUsuario] = useState('')
  const [falhaEditUsuario, setFalhaEditUsuario] = useState(false)
  const [modalFalhaEditUsuarioShow, setModalFalhaEditUsuarioShow] = useState(false)
  const [messageFalhaEditUsuario, setMessageFalhaEditUsuario] = useState('')

  const { atualizaUsuarios } = useContext(DadosContext)

  const { handleSubmit } = useForm()

  const formAtualizaUsuario = () => {
    const dadosAtualizaUsuario = {
      id,
      primeiroNome: primeiroNomeEditadoUsuario,
      ultimoNome: ultimoNomeEditadoUsuario,
      email: emailEditadoUsuario,
      userName: userNameEditadoUsuario
    }

    api
      .put('Account/atualiza-usuario', dadosAtualizaUsuario)

      .then((response) => {
        if (response.status === 200) {
          setMessageSuccessEditUsuario(response.data.message)
          setSuccessEditUsuario(true)
          setModalSuccessEditUsuarioShow(true)
          atualizaUsuarios()
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          setMessageFalhaEditUsuario(error.response.data.message)
          setFalhaEditUsuario(true)
          setModalFalhaEditUsuarioShow(true)
        }
      })
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
            <div className="headerModalEdit">
              <h4>Editar usuário</h4>
            </div>

            <div className="bodyModalEdit">
              <form className="formEdicaoAgente" onSubmit={handleSubmit(formAtualizaUsuario)}>
                <div className="editaUsuario">
                  <div className="labelForm col-5">
                    <input
                      type="text"
                      name="primeiroNomeEdicaoUsuario"
                      placeholder="Primeiro nome"
                      className="form-control"
                      id="primeiroNomeEdicaoUsuario"
                      value={primeiroNomeEditadoUsuario}
                      onChange={(e) => setPrimeiroNomeEditadoUsuario(e.target.value)}
                    />
                    <label htmlFor="primeiroNomeEdicaoUsuario">Primeiro nome</label>
                  </div>

                  <div className="labelForm col-6">
                    <input
                      type="text"
                      name="ultimoNomeEdicaoUsuario"
                      placeholder="Último nome"
                      className="form-control"
                      id="ultimoNomeEdicaoUsuario"
                      value={ultimoNomeEditadoUsuario}
                      onChange={(e) => setUltimoNomeEditadoUsuario(e.target.value)}
                    />
                    <label htmlFor="ultimoNomeEdicaoUsuario">Último nome</label>
                  </div>

                  <div className="labelForm col-11 col-md-5">
                    <input
                      type="text"
                      name="userNameEdicaoUsuario"
                      placeholder="Nome de usuário"
                      className="form-control"
                      id="userNameEdicaoUsuario"
                      value={userNameEditadoUsuario}
                      onChange={(e) => setUserNameEditadoUsuario(e.target.value)}
                    />
                    <label htmlFor="userNameEdicaoUsuario">Nome de usuário</label>
                  </div>

                  <div className="labelForm col-11 col-md-6">
                    <input
                      type="text"
                      name="emailEdicaoUsuario"
                      placeholder="E-mail"
                      className="form-control"
                      id="emailEdicaoUsuario"
                      value={emailEditadoUsuario}
                      onChange={(e) => setEmailEditadoUsuario(e.target.value)}
                    />
                    <label htmlFor="emailEdicaoUsuario">E-mail</label>
                  </div>
                </div>

                <div className="buttonsModalEdit">
                  {/* <ButtonSubmit text={'Salvar'} onClick={handleSubmit(formAtualizaAgente)}></ButtonSubmit> */}
                  <Button
                    type="submit"
                    onClick={handleSubmit(formAtualizaUsuario)}
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

export default ModalEdicaoUsuario
