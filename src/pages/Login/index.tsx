/* eslint-disable import/order */
/* eslint-disable import-helpers/order-imports */
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ButtonSubmit from '../../components/ButtonSubmit'

import './Login.css'

import { ErrorMessage } from '../../components/ErrorMessage'
import ModalMessage from '../../components/ModalMessage'
import { AuthContext } from '../../contexts/AuthContext'

import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'

function Login() {
  const navigate = useNavigate()

  const { loginUsuario, errorLogin, errorLoad, modalShow, setModalShow } = useContext(AuthContext)

  const [userName, setUserName] = useState('')
  const [typeSenha, setTypeSenha] = useState('password')
  const [senha, setSenha] = useState('')
  const [ocultaSenha, setOcultaSenha] = useState(true)

  function changeUser(e) {
    setUserName(e.target.value)
  }

  function changePassword(e) {
    setSenha(e.target.value)
  }

  function showSenha() {
    setTypeSenha('text')
    setOcultaSenha(false)
  }

  function hideSenha() {
    setTypeSenha('password')
    setOcultaSenha(true)
  }

  async function loginForm(e) {
    e.preventDefault()

    const response = loginUsuario(userName, senha)

    if (response) {
      return
    }

    navigate('/digitalizacao')
  }

  return (
    <div className="login">
      <div className="headerLogin">
        <h4>MONITRAN - Sistema de Permissionários</h4>
      </div>

      <div className="loginUser">
        {errorLoad && (
          <ModalMessage
            title={['Erro na conexão com o servidor.']}
            className="modalFalha"
            text="Houve um erro na conexão com o servidor. Por favor, tente novamente mais tarde."
            textbutton="Fechar"
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        )}

        <h3>Login</h3>

        <form onSubmit={loginForm} className="formLogin col-11 mt-3">
          <div className="labelLogin">
            <label>Usuário</label>
            <input type="text" name="usuario" value={userName} onChange={changeUser} />
          </div>

          <div className="labelLogin">
            <label>Senha</label>
            <input type={typeSenha} name="senha" value={senha} onChange={changePassword} />
            <div className="buttonHideSenha col-1">
              {ocultaSenha ? (
                <BsFillEyeFill size={20} onClick={showSenha} />
              ) : (
                <BsFillEyeSlashFill size={20} onClick={hideSenha} />
              )}
            </div>
          </div>

          <ErrorMessage text={errorLogin} />

          <div className="buttonLogin col-12">
            <ButtonSubmit type="submit" text="Entrar" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
