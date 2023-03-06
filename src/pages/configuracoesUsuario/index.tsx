import { yupResolver } from '@hookform/resolvers/yup'
import Tooltip from '@mui/material/Tooltip'
import './configuracoesUsuario.css'
import React, { useState, useContext, useEffect, ChangeEventHandler } from 'react'
import Table from 'react-bootstrap/Table'
import { useForm } from 'react-hook-form'
import { BiArrowBack } from 'react-icons/bi'
import { BsSearch, BsFillPersonPlusFill, BsFillEyeSlashFill, BsFillEyeFill } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'
import { MdPersonOff, MdPerson } from 'react-icons/md'
import * as yup from 'yup'

import ButtonSubmit from '../../components/ButtonSubmit'
import { ErrorMessage } from '../../components/ErrorMessage'
import { ErrorForm } from '../../components/FormTalao/ErrorForm'
import ModalEdicaoUsuario from '../../components/ModalEdicaoUsuario'
import ModalInativacaoUsuario from '../../components/ModalInativaUsuario'
import ModalMessage from '../../components/ModalMessage'
import ModalReativacaoUsuario from '../../components/ModalReativaUsuario'
import SideBar from '../../components/SideBarLateral'
import { AuthContext } from '../../contexts/AuthContext'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'
import { DadosContext } from '../../contexts/DadosContext'

function CriaUsuario() {
  const {
    criaUsuario,
    errorSignup,
    userCreated,
    modalUserCreated,
    setModalUserCreated,
    userCreatedFailed,
    modalUserCreatedFailed,
    setModalUserCreatedFailed,
    messageModalSignup,
    Permissoes
  } = useContext(AuthContext)

  const { classSideNav } = useContext(CondicionaisFormContext)
  const { TiposUsuario, Usuarios, atualizaUsuarios } = useContext(DadosContext)

  const [primeiroNome, setPrimeiroNome] = useState('')
  const [ultimoNome, setUltimoNome] = useState('')
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
  const [typeSenha, setTypeSenha] = useState('password')
  const [ocultaSenha, setOcultaSenha] = useState(true)
  const [typeConfirmaSenha, setTypeConfirmaSenha] = useState('password')
  const [ocultaConfirmaSenha, setOcultaConfirmaSenha] = useState(true)
  // const [tipoUsuario, setTipoUsuario] = useState(0);

  const validaCriacaoUsuario = yup.object({
    tipoUsuario: yup.number().required('Campo obrigatório')
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validaCriacaoUsuario)
  })

  function showSenha() {
    setTypeSenha('text')
    setOcultaSenha(false)
  }

  function hideSenha() {
    setTypeSenha('password')
    setOcultaSenha(true)
  }

  function showConfirmacaoSenha() {
    setTypeConfirmaSenha('text')
    setOcultaConfirmaSenha(false)
  }

  function hideConfirmacaoSenha() {
    setTypeConfirmaSenha('password')
    setOcultaConfirmaSenha(true)
  }

  const handleSignup = (data) => {
    const { tipoUsuario } = data

    const res = criaUsuario({ primeiroNome, ultimoNome, email, userName, senha, confirmacaoSenha, tipoUsuario })

    if (res !== null) {
      return console.log('res')
    }
    // revisar novamente
  }

  const [tabelaUsuarios, setTabelaUsuarios] = useState(true)
  const [cadastraUsuarios, setCadastraUsuarios] = useState(false)

  function ativaCadastroUsuarios() {
    setCadastraUsuarios(true)
    setTabelaUsuarios(false)
  }

  const [filterSearchUsuario, setFilterSearchUsuario] = useState([])
  const [filterGeral, setFilterGeral] = useState('Todos')
  const [searchUsuario, setSearchUsuario] = useState('')
  /* eslint no-self-compare: "error" */
  const [filterInativos, setFilterInativos] = useState([])
  const [filterAtivos, setFilterAtivos] = useState([])

  function onChangeBuscaUsuario(e): void {
    e.preventDefault()
    setSearchUsuario(e.target.value)

    if (filterGeral === 'Todos') {
      const Filtro = Usuarios.filter((value) => value.userName?.toLowerCase().includes(e.target.value.toLowerCase()))

      setFilterSearchUsuario(Filtro)
    } else if (filterGeral === 'Inativos') {
      const Filtro = filterInativos.filter((value) =>
        value.userName?.toLowerCase().includes(e.target.value.toLowerCase())
      )

      setFilterSearchUsuario(Filtro)
    } else if (filterGeral === 'Ativos') {
      const Filtro = filterAtivos.filter((value) =>
        value.userName?.toLowerCase().includes(e.target.value.toLowerCase())
      )

      setFilterSearchUsuario(Filtro)
    }
  }

  useEffect(() => {
    setFilterSearchUsuario(Usuarios)
  }, [Usuarios])

  useEffect(() => {
    if (filterGeral === 'Todos') {
      const FiltroGeral = Usuarios
      setFilterSearchUsuario(FiltroGeral)
    } else if (filterGeral === 'Ativos') {
      const FiltroGeral = Usuarios.filter((value) => !value.dataInativo)
      setFilterAtivos(FiltroGeral)
      setFilterSearchUsuario(FiltroGeral)
    } else if (filterGeral === 'Inativos') {
      const FiltroGeral = Usuarios.filter((value) => value.dataInativo)
      setFilterInativos(FiltroGeral)
      setFilterSearchUsuario(FiltroGeral)
    }
  }, [filterGeral, Usuarios])

  const [linhasPerPage, setLinhasPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(0)

  const pages = Math.ceil(filterSearchUsuario.length / linhasPerPage - 1)
  const startIndex = currentPage * linhasPerPage
  const endIndex = startIndex + linhasPerPage
  const currentUsuarios = filterSearchUsuario.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(0)
  }, [linhasPerPage])

  const [showIcon, setShowIcon] = useState({})

  const mostraIcon = (valor) => () => {
    setShowIcon((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const [messageDataInativo, setMessageDataInativo] = useState({})

  const ativaMessageDataInativo = (valor) => () => {
    setMessageDataInativo((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const [showModalEdit, setShowModalEdit] = useState({})
  const [showModalInvalid, setShowModalInvalid] = useState({})
  const [showModalReative, setShowModalReative] = useState({})

  const mostraEdicao = (valor) => () => {
    setShowModalEdit((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const mostraInativacao = (valor) => () => {
    setShowModalInvalid((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const mostraReativacao = (valor) => () => {
    setShowModalReative((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const [iconOrdenaNumero, setIconOrdenaNumero] = useState(true)
  // const [iconOrdenaNome, setIconOrdenaNome] = useState(true)

  return (
    <div className="content">
      {Permissoes.toString() === 'Administrador' && (
        <div className="sideNavLateral">
          <SideBar />
        </div>
      )}

      <div className={`${classSideNav === 'sidenav' ? 'conteudoComSidenav' : 'conteudoSemSidenav'}`}>
        <div className="container mt-3">
          <h2>Configurações de usuário</h2>

          <div className="menuNavegacao mb-2">
            <div className="iconsMenu">
              <div className="pesquisaTabela">
                <form>
                  <div className="labelFiltroAgente">
                    <select defaultValue={filterGeral} onChange={(e) => setFilterGeral(e.target.value)}>
                      <option>Todos</option>
                      <option>Ativos</option>
                      <option>Inativos</option>
                    </select>

                    <input
                      type="text"
                      name="buscaUsuario"
                      placeholder="Pesquisar usuário"
                      className="formFiltroAgente form-control"
                      id="buscaUsuario"
                      value={searchUsuario}
                      onChange={onChangeBuscaUsuario}
                    />

                    <Tooltip title="Registros por página" placement="bottom" arrow>
                      <select
                        className="quantidadeRegistros"
                        defaultValue={linhasPerPage}
                        onChange={(e) => setLinhasPerPage(Number(e.target.value))}
                      >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                      </select>
                    </Tooltip>
                  </div>
                </form>
              </div>

              <div className="itemMenuNavegacao">
                {tabelaUsuarios ? (
                  <Tooltip title="Novo usuário" placement="bottom" arrow>
                    <div>
                      <BsFillPersonPlusFill size={25} onClick={ativaCadastroUsuarios} className="iconNavegacao" />
                    </div>
                  </Tooltip>
                ) : (
                  <Tooltip title="Voltar a consulta" placement="bottom" arrow>
                    <div>
                      <BiArrowBack
                        size={25}
                        onClick={() => [setTabelaUsuarios(true), setCadastraUsuarios(false), atualizaUsuarios()]}
                        className="iconNavegacao"
                      />
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          {tabelaUsuarios && (
            <div className="tabelaAgentes container">
              <Table striped bordered>
                <thead>
                  <tr>
                    <th className="headerTabela">Usuário</th>

                    <th className="headerTabela">Primeiro nome</th>

                    <th className="headerTabela">Último nome</th>
                    <th className="headerTabelaEmail">
                      <span>E-mail</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentUsuarios.map((dado, valor) => {
                    const anoData = dado.dataInativo?.slice(0, 4)
                    const mesData = dado.dataInativo?.slice(5, 7)
                    const diaData = dado.dataInativo?.slice(8, 10)

                    const data = `${diaData}/${mesData}/${anoData}`
                    const dataFinal = data === 'undefined/undefined/undefined' ? null : data

                    return (
                      <tr key={dado.id} className="linhaAgentes">
                        <td className="dadoTabela">
                          <div className={`${dataFinal === null ? 'textNomeAgente' : 'textNomeAgenteInativo'}`}>
                            {dado.userName}
                          </div>
                        </td>
                        <td className="dadoTabela">
                          <div className={`${dataFinal === null ? 'textNomeAgente' : 'textNomeAgenteInativo'}`}>
                            {dado.primeiroNome}
                          </div>
                        </td>
                        <td className="dadoTabela">
                          <div className={`${dataFinal === null ? 'textNomeAgente' : 'textNomeAgenteInativo'}`}>
                            {dado.ultimoNome}
                          </div>
                        </td>
                        <td
                          className="dadoTabelaEmail"
                          onMouseEnter={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                          onMouseLeave={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                          onClick={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                        >
                          <div className={`${dataFinal === null ? 'textNomeAgente' : 'textNomeAgenteInativo'}`}>
                            {dado.email}
                          </div>

                          {showIcon[valor] && (
                            <div className="iconsModificacao">
                              <Tooltip title="Editar" placement="top" arrow>
                                <div>
                                  <FaRegEdit size={30} className="iconEdit col-12" onClick={mostraEdicao(valor)} />
                                </div>
                              </Tooltip>

                              <Tooltip title="Inativar" placement="top" arrow>
                                <div>
                                  <MdPersonOff size={32} className="iconInative" onClick={mostraInativacao(valor)} />
                                </div>
                              </Tooltip>
                            </div>
                          )}

                          {messageDataInativo[valor] && (
                            <div className="reativaAgente">
                              <span className="messageInativo">Inativado em: {dataFinal}</span>
                              <Tooltip title="Reativar" placement="top" arrow>
                                <div>
                                  <MdPerson size={32} className="iconReativar" onClick={mostraReativacao(valor)} />
                                </div>
                              </Tooltip>
                            </div>
                          )}
                        </td>

                        {showModalEdit[valor] && (
                          <td className="modalEdit">
                            <ModalEdicaoUsuario
                              show={!!showModalEdit}
                              onHide={() => [setShowModalEdit(false), setShowIcon(false)]}
                              onClick={() => setShowModalEdit(false)}
                              textbutton="Salvar"
                              textbutton2="Cancelar"
                              primeironome={dado.primeiroNome}
                              ultimonome={dado.ultimoNome}
                              username={dado.userName}
                              email={dado.email}
                              id={dado.id}
                            />
                          </td>
                        )}

                        {showModalInvalid[valor] && (
                          <td className="modalInvalid">
                            <ModalInativacaoUsuario
                              show={!!showModalInvalid}
                              onHide={() => [setShowModalInvalid(false), setShowIcon(false)]}
                              onClick={() => setShowModalInvalid(false)}
                              textbutton="Inativar"
                              textbutton2="Cancelar"
                              username={dado.userName}
                              id={dado.id}
                            />
                          </td>
                        )}

                        {showModalReative[valor] && (
                          <td className="modalInvalid">
                            <ModalReativacaoUsuario
                              show={!!showModalReative}
                              onHide={() => [setShowModalReative(false), setShowIcon(false)]}
                              onClick={() => setShowModalReative(false)}
                              textbutton="Reativar"
                              textbutton2="Cancelar"
                              username={dado.userName}
                              id={dado.id}
                            />
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </Table>

              {/* <div className='paginacao container'>
                                <Pagination>
                                    <Pagination.First onClick={() => setCurrentPage(0)} />
                                    <Pagination.Prev onClick={currentPage === 0 ?
                                        () => setCurrentPage(0)
                                        :
                                        () => setCurrentPage(currentPage - 1)} />
                                    <Pagination.Item active>{currentPage + 1}</Pagination.Item>

                                    {currentPage >= 0 && currentPage <= pages - 1 &&
                                        <>
                                            {currentPage === pages - 1 ?
                                                null
                                                : currentPage === pages - 2 ?
                                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 2}</Pagination.Item>
                                                    : currentPage === pages - 3 ?
                                                        <>
                                                            <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 2}</Pagination.Item>
                                                            <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 3}</Pagination.Item>
                                                        </>
                                                        : currentPage === pages - 4 ?
                                                            <>
                                                                <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 2}</Pagination.Item>
                                                                <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 3}</Pagination.Item>
                                                                <Pagination.Item onClick={() => setCurrentPage(currentPage + 3)}>{currentPage + 4}</Pagination.Item>
                                                            </>
                                                            : currentPage === pages - 5 ?
                                                                <>
                                                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 2}</Pagination.Item>
                                                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 3}</Pagination.Item>
                                                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 3)}>{currentPage + 4}</Pagination.Item>
                                                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 4)}>{currentPage + 5}</Pagination.Item>
                                                                </>
                                                                :
                                                                <>
                                                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 2}</Pagination.Item>
                                                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 3}</Pagination.Item>
                                                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 3)}>{currentPage + 4}</Pagination.Item>
                                                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 4)}>{currentPage + 5}</Pagination.Item>
                                                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 5)}>{currentPage + 6}</Pagination.Item>
                                                                </>

                                            }
                                        </>
                                    }

                                    <Pagination.Ellipsis />
                                    <Pagination.Item onClick={() => setCurrentPage(pages)}>{pages + 1}</Pagination.Item>
                                    <Pagination.Next onClick={currentPage === pages ? () => setCurrentPage(pages)
                                        :
                                        () => setCurrentPage(currentPage + 1)} />
                                    <Pagination.Last onClick={() => setCurrentPage(pages)} />
                                </Pagination>
                            </div> */}
            </div>
          )}

          {cadastraUsuarios && (
            <div className="cadastro novoUsuario">
              <form className="criaUsuario mb-4 mt-3" onSubmit={handleSubmit(handleSignup)} autoComplete="off">
                <div className="formCriaUsuario">
                  <div className="labelForm col-12 col-md-5">
                    <input
                      type="text"
                      className="form-control"
                      name="primeiroNome"
                      id="primeiroNome"
                      placeholder="Primeiro Nome"
                      onChange={(e) => setPrimeiroNome(e.target.value)}
                      value={primeiroNome}
                    />
                    <label htmlFor="primeiroNome">Primeiro nome</label>
                  </div>

                  <div className="labelForm col-12 col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="ultimoNome"
                      placeholder="Último nome"
                      id="ultimoNome"
                      onChange={(e) => setUltimoNome(e.target.value)}
                      value={ultimoNome}
                    />
                    <label htmlFor="ultimoNome">Último nome</label>
                  </div>

                  <div className="labelForm col-12 col-md-5">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="email"
                      placeholder="E-mail"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                    <label htmlFor="email">E-mail</label>
                  </div>

                  <div className="labelForm col-12 col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="login"
                      id="login"
                      placeholder="Usuário"
                      onChange={(e) => setUserName(e.target.value)}
                      value={userName}
                    />
                    <label htmlFor="login">Usuário</label>
                  </div>

                  <div className="labelForm col-12 col-md-5">
                    <input
                      type={typeSenha}
                      className="form-control"
                      name="senha"
                      placeholder="Senha"
                      id="senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                    <label htmlFor="senha">Senha</label>
                    <div className="buttonHideSenha col-1">
                      {ocultaSenha ? (
                        <BsFillEyeFill size={15} onClick={showSenha} />
                      ) : (
                        <BsFillEyeSlashFill size={15} onClick={hideSenha} />
                      )}
                    </div>
                  </div>

                  <div className="labelForm col-12 col-md-6 mb-3">
                    <input
                      type={typeConfirmaSenha}
                      className="form-control"
                      name="confirmacaoSenha"
                      placeholder="Confirmação de senha"
                      id="confirmacaoSenha"
                      value={confirmacaoSenha}
                      onChange={(e) => setConfirmacaoSenha(e.target.value)}
                    />
                    <label htmlFor="confirmacaoSenha">Confirmação de senha</label>

                    <div className="buttonHideSenha col-1">
                      {ocultaConfirmaSenha ? (
                        <BsFillEyeFill size={15} onClick={showConfirmacaoSenha} />
                      ) : (
                        <BsFillEyeSlashFill size={15} onClick={hideConfirmacaoSenha} />
                      )}
                    </div>
                  </div>

                  <div className="labelForm mt-2 mb-3 col-12 col-md-11">
                    <select
                      name="tipoUsuario"
                      id="tipoUsuario"
                      className="col-12"
                      defaultValue="SELECIONE O TIPO DE USUÁRIO"
                      {...register('tipoUsuario')}
                    >
                      <option disabled>SELECIONE O TIPO DE USUÁRIO</option>
                      {TiposUsuario?.map((dado, valor) => (
                        <option key={dado.id} value={valor + 1}>
                          {dado.descricao}
                        </option>
                      ))}
                    </select>{' '}
                    <br />
                    {errors?.tipoUsuario?.type && <ErrorForm />}
                  </div>

                  <ErrorMessage text={errorSignup} />

                  <div className="buttonCriaUsuario col-12">
                    <ButtonSubmit text="Cadastrar" />
                  </div>
                </div>
              </form>

              {userCreated && (
                <ModalMessage
                  title={[messageModalSignup]}
                  className="modalSuccess"
                  textbutton="Cadastrar novo usuário"
                  textbutton2="Ir para o ínicio"
                  show={modalUserCreated}
                  onHide={() => [
                    setModalUserCreated(false),
                    setPrimeiroNome(''),
                    setUltimoNome(''),
                    setEmail(''),
                    setUserName(''),
                    setSenha(''),
                    setConfirmacaoSenha(''),
                    reset()
                  ]}
                />
              )}
              {userCreatedFailed && (
                <ModalMessage
                  title={[messageModalSignup]}
                  className="modalFalha"
                  textbutton="Tentar novamente"
                  textbutton2="Ir para o ínicio"
                  show={modalUserCreatedFailed}
                  onHide={() => [
                    setModalUserCreatedFailed(false),
                    setPrimeiroNome(''),
                    setUltimoNome(''),
                    setEmail(''),
                    setUserName(''),
                    setSenha(''),
                    setConfirmacaoSenha('')
                  ]}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CriaUsuario
