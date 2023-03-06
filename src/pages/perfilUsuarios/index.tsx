import React, { useContext, useEffect, useState } from 'react'

import './perfilUsuarios.css'
import { BiArrowBack } from 'react-icons/bi'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import Tooltip from '@mui/material/Tooltip'

import ModalMessage from '../../components/ModalMessage'
import SideBar from '../../components/SideBarLateral'
import { AuthContext } from '../../contexts/AuthContext'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'
import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'

function PerfilUsuarios() {
  const { classSideNav } = useContext(CondicionaisFormContext)
  const { user } = useContext(AuthContext)
  const { Usuarios } = useContext(DadosContext)

  const [informacoesPerfil, setInformacoesPerfil] = useState(true)
  const [redefinicaoSenha, setRedefinicaoSenha] = useState(false)

  function ativaRedefinicaoSenha() {
    setRedefinicaoSenha(!redefinicaoSenha)
    setInformacoesPerfil(!informacoesPerfil)
  }

  const [typeSenhaAtual, setTypeSenhaAtual] = useState('password')
  const [ocultaSenhaAtual, setOcultaSenhaAtual] = useState(true)
  const [typeNovaSenha, setTypeNovaSenha] = useState('password')
  const [ocultaNovaSenha, setOcultaNovaSenha] = useState(true)
  const [typeConfirmacaoSenha, setTypeConfirmacaoSenha] = useState('password')
  const [ocultaConfirmacaoSenha, setOcultaConfirmacaoSenha] = useState(true)

  function showSenhaAtual() {
    setTypeSenhaAtual('text')
    setOcultaSenhaAtual(false)
  }

  function hideSenhaAtual() {
    setTypeSenhaAtual('password')
    setOcultaSenhaAtual(true)
  }

  function showNovaSenha() {
    setTypeNovaSenha('text')
    setOcultaNovaSenha(false)
  }

  function hideNovaSenha() {
    setTypeNovaSenha('password')
    setOcultaNovaSenha(true)
  }

  function showConfirmacaoSenha() {
    setTypeConfirmacaoSenha('text')
    setOcultaConfirmacaoSenha(false)
  }

  function hideConfirmacaoSenha() {
    setTypeConfirmacaoSenha('password')
    setOcultaConfirmacaoSenha(true)
  }

  const [nomeUsuario, setNomeUsuario] = useState('')
  const [emailUsuario, setEmailUsuario] = useState('')

  useEffect(() => {
    api
      .get(`/Account/detalhes-usuario?userName=${user}`)
      .then((response) => {
        setNomeUsuario(`${response.data.data.primeiroNome} ${response.data.data.ultimoNome}`)
        setEmailUsuario(response.data.data.email)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmacaoNovaSenha, setConfirmacaoNovaSenha] = useState('')
  const [senhaAlterada, setSenhaAlterada] = useState(false)
  const [modalSenhaAlterada, setModalSenhaAlterada] = useState(false)
  const [senhaAlteradaFailed, setSenhaAlteradaFailed] = useState(false)
  const [modalSenhaAlteradaFailed, setModalSenhaAlteradaFailed] = useState(false)
  const [messageModalAlteracaoSenha, setMessageModalAlteracaoSenha] = useState('')

  function confirmaAlteracaoSenha() {
    const dadosAtualizacaoSenha = {
      userName: user,
      senha: senhaAtual,
      novaSenha,
      confirmacaoSenha: confirmacaoNovaSenha
    }

    api
      .put('Account/atualiza-senha', dadosAtualizacaoSenha)
      .then((response) => {
        setMessageModalAlteracaoSenha(response.data.message)
        setSenhaAlterada(true)
        setModalSenhaAlterada(true)
      })
      .catch((error) => {
        setMessageModalAlteracaoSenha(error.data.message)
        setSenhaAlteradaFailed(true)
        setModalSenhaAlteradaFailed(true)
      })
  }

  return (
    <div className="content">
      <div className="sideNavLateral">
        <SideBar />
      </div>

      <div className={`${classSideNav === 'sidenav' ? 'conteudoComSidenav' : 'conteudoSemSidenav'}`}>
        <div className="alterarSenha container mt-3">
          <h2 className="mt-3">Meu perfil</h2>

          {informacoesPerfil && (
            <form className="formLogin mb-4 mt-3" autoComplete="off">
              <div className="formCriaUsuario">
                <div className="labelForm col-12 mt-2">
                  <input
                    type="text"
                    className="form-control"
                    name="primeiroNome"
                    id="primeiroNome"
                    placeholder="Nome"
                    readOnly
                    defaultValue={nomeUsuario}
                  />
                  <label htmlFor="primeiroNome">Nome</label>
                </div>

                <div className="labelForm col-12 mt-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="E-mail"
                    readOnly
                    defaultValue={emailUsuario}
                  />
                  <label htmlFor="email">E-mail</label>
                </div>

                <div className="labelForm col-12 mt-3">
                  <input
                    type="text"
                    className="form-control"
                    name="login"
                    id="login"
                    placeholder="Usuário"
                    readOnly
                    defaultValue={user}
                  />
                  <label htmlFor="login">Usuário</label>
                </div>

                <div className="labelForm col-12 mt-3">
                  <div className="redefinirSenha" onClick={ativaRedefinicaoSenha}>
                    <span>Redefinir senha</span>
                  </div>
                </div>
              </div>
            </form>
          )}

          {redefinicaoSenha && (
            <form className="formLogin mb-4 mt-3" autoComplete="off">
              <div className="formCriaUsuario">
                <div className="labelForm col-12 mt-2">
                  <input
                    type={typeSenhaAtual}
                    className="form-control"
                    name="senhaAtual"
                    id="senhaAtual"
                    placeholder="Senha atual"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                  />
                  <label htmlFor="senhaAtual">Senha atual</label>

                  <div className="buttonHideSenha">
                    {ocultaSenhaAtual ? (
                      <BsFillEyeFill size={20} onClick={showSenhaAtual} />
                    ) : (
                      <BsFillEyeSlashFill size={20} onClick={hideSenhaAtual} />
                    )}
                  </div>
                </div>

                <div className="labelForm col-12 mt-3">
                  <input
                    type={typeNovaSenha}
                    className="form-control"
                    name="novaSenha"
                    id="novaSenha"
                    placeholder="E-mail"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                  />
                  <label htmlFor="novaSenha">Nova senha</label>

                  <div className="buttonHideSenha">
                    {ocultaNovaSenha ? (
                      <BsFillEyeFill size={20} onClick={showNovaSenha} />
                    ) : (
                      <BsFillEyeSlashFill size={20} onClick={hideNovaSenha} />
                    )}
                  </div>
                </div>

                <div className="labelForm col-12 mt-3">
                  <input
                    type={typeConfirmacaoSenha}
                    className="form-control"
                    name="confirmacaoSenha"
                    id="confirmacaoSenha"
                    placeholder="Confirmar nova senha"
                    value={confirmacaoNovaSenha}
                    onChange={(e) => setConfirmacaoNovaSenha(e.target.value)}
                  />
                  <label htmlFor="confirmacaoSenha">Confirmar nova senha</label>
                  <div className="buttonHideSenha">
                    {ocultaConfirmacaoSenha ? (
                      <BsFillEyeFill size={20} onClick={showConfirmacaoSenha} />
                    ) : (
                      <BsFillEyeSlashFill size={20} onClick={hideConfirmacaoSenha} />
                    )}
                  </div>
                </div>

                <div className="confirmaAlteracao col-12 mt-3">
                  <Tooltip title="Voltar ao perfil" placement="bottom" arrow className="voltarPerfil">
                    <div>
                      <BiArrowBack size={25} onClick={ativaRedefinicaoSenha} className="iconNavegacao" />
                    </div>
                  </Tooltip>
                  <div className="confirmarSenha col-8" onClick={confirmaAlteracaoSenha}>
                    <span>Confirmar alteração de senha</span>
                  </div>
                </div>
              </div>
            </form>
          )}

          {senhaAlterada && (
            <ModalMessage
              title={[messageModalAlteracaoSenha]}
              className="modalSuccess"
              textbutton="Voltar ao perfil"
              textbutton2="Ir para o ínicio"
              show={modalSenhaAlterada}
              onHide={() => [
                setModalSenhaAlterada(false),
                setInformacoesPerfil(true),
                setRedefinicaoSenha(false),
                setSenhaAtual(''),
                setNovaSenha(''),
                setConfirmacaoNovaSenha(''),
                setOcultaSenhaAtual(true),
                setOcultaNovaSenha(true),
                setOcultaConfirmacaoSenha(true)
              ]}
            />
          )}
          {senhaAlteradaFailed && (
            <ModalMessage
              title={[messageModalAlteracaoSenha]}
              className="modalFalha"
              textbutton="Tentar novamente"
              show={modalSenhaAlteradaFailed}
              onHide={() => [
                setModalSenhaAlteradaFailed(false),
                setSenhaAtual(''),
                setNovaSenha(''),
                setConfirmacaoNovaSenha('')
              ]}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default PerfilUsuarios
