/* eslint-disable react/jsx-no-useless-fragment */
import './configuracoesAgente.css'
import { yupResolver } from '@hookform/resolvers/yup'
import Tooltip from '@mui/material/Tooltip'
import React, { useContext, useEffect, useState } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import Table from 'react-bootstrap/Table'
import { useForm } from 'react-hook-form'
import { BiArrowBack } from 'react-icons/bi'
import { BsSearch, BsFillPersonPlusFill } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'
import { MdPersonOff, MdPerson } from 'react-icons/md'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
import * as yup from 'yup'

import ButtonSubmit from '../../components/ButtonSubmit'
import { ErrorForm } from '../../components/FormTalao/ErrorForm'
import ModalEdicaoAgente from '../../components/ModalEdicaoAgente'
import ModalInativacaoAgente from '../../components/ModalInativaAgente'
import ModalMessage from '../../components/ModalMessage'
import ModalReativacaoAgente from '../../components/ModalReativaAgente'
import SideBar from '../../components/SideBarLateral'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'
import { DadosContext } from '../../contexts/DadosContext'
import { AuthContext } from '../../contexts/AuthContext'
import api from '../../services/api'

function CriaAgente() {
  const { classSideNav } = useContext(CondicionaisFormContext)
  const { Permissoes } = useContext(AuthContext)

  const [successAgente, setSuccessAgente] = useState(false)
  const [modalSuccessAgenteShow, setModalSuccessAgenteShow] = useState(false)
  const [falhaAgente, setFalhaAgente] = useState(false)
  const [modalFalhaAgenteShow, setModalFalhaAgenteShow] = useState(false)
  const [messageSuccessAgente, setMessageSuccessAgente] = useState('')
  const [messageFalhaAgente, setMessageFalhaAgente] = useState('')
  const [cadastraAgente, setCadastraAgente] = useState(false)
  const [tabelaAgentes, setTabelaAgentes] = useState(true)

  function ativaCadastroAgente() {
    setCadastraAgente(true)
    setTabelaAgentes(false)
  }

  function ativaPesquisa() {
    setTabelaAgentes(true)
    setCadastraAgente(false)
    setCurrentPage(0)
  }

  const { cpfAgenteValue, setCpfAgenteValue, inputCpfAgenteMask, Corporacao, Agentes, atualizaAgentes } =
    useContext(DadosContext)

  const validaCriacaoAgente = yup.object({
    nomeAgente: yup.string().required(),
    cpfAgente: yup.string().required(),
    corporacao: yup.number().required()
  })

  function submitAgente() {
    setSuccessAgente(true)
    setModalSuccessAgenteShow(true)
    setNomeAgente('')
    setCpfAgenteValue('')
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validaCriacaoAgente)
  })

  const formCriaAgente = (data) => {
    const dadosAgente = {
      corporacaoId: data.corporacao,
      nome: data.nomeAgente,
      cpf: data.cpfAgente,
      numero: data.numeroAgente
    }

    api
      .post('Agente', dadosAgente)

      .then((response) => {
        if (response.status === 200) {
          setMessageSuccessAgente(response.data.message)
          submitAgente()
          atualizaAgentes()
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          setMessageFalhaAgente(error.response.data.message)
          setFalhaAgente(true)
          setModalFalhaAgenteShow(true)
        }
      })
  }

  const [nomeAgente, setNomeAgente] = useState('')
  const [searchAgente, setSearchAgente] = useState('')
  const [filterSearchAgente, setFilterSearchAgente] = useState([])
  const [filterAtivos, setFilterAtivos] = useState([])
  const [filterInativos, setFilterInativos] = useState([])

  useEffect(() => {
    setFilterSearchAgente(Agentes)
  }, [Agentes])

  const [filterGeral, setFilterGeral] = useState('Todos')

  useEffect(() => {
    setCurrentPage(0)

    if (filterGeral === 'Todos') {
      const FiltroGeral = Agentes
      setFilterSearchAgente(FiltroGeral)
    } else if (filterGeral === 'Ativos') {
      const FiltroGeral = Agentes.filter((value) => !value.dataInativo)
      setFilterAtivos(FiltroGeral)
      setFilterSearchAgente(FiltroGeral)
    } else if (filterGeral === 'Inativos') {
      const FiltroGeral = Agentes.filter((value) => value.dataInativo)
      setFilterInativos(FiltroGeral)
      setFilterSearchAgente(FiltroGeral)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterGeral])

  const onChangeBuscaAgente = (e) => {
    e.preventDefault()
    setSearchAgente(e.target.value)

    if (filterGeral === 'Todos') {
      const Filtro = Agentes.filter(
        (value) =>
          value.nome?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.numero?.toString().includes(e.target.value)
      )

      setFilterSearchAgente(Filtro)
    } else if (filterGeral === 'Inativos') {
      const Filtro = filterInativos.filter(
        (value) =>
          value.nome?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.numero?.toString().includes(e.target.value)
      )

      setFilterSearchAgente(Filtro)
    } else if (filterGeral === 'Ativos') {
      const Filtro = filterAtivos.filter(
        (value) =>
          value.nome?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.numero?.toString().includes(e.target.value)
      )

      setFilterSearchAgente(Filtro)
    }
  }

  useEffect(() => {
    if (searchAgente.length > 0) {
      ativaPesquisa()
    }
    // eslint-disable-next-line
    }, [searchAgente])

  const [linhasPerPage, setLinhasPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(0)

  const pages = Math.ceil(filterSearchAgente.length / linhasPerPage - 1)
  const startIndex = currentPage * linhasPerPage
  const endIndex = startIndex + linhasPerPage
  const currentAgentes = filterSearchAgente.slice(startIndex, endIndex)

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
  const [iconOrdenaNome, setIconOrdenaNome] = useState(true)

  return (
    <div className="content">
      {Permissoes.toString() === 'Administrador' && (
        <div className="sideNavLateral">
          <SideBar />
        </div>
      )}

      <div className={`${classSideNav === 'sidenav' ? 'conteudoComSidenav' : 'conteudoSemSidenav'}`}>
        <div className="container mt-3">
          <h2>Configurações de Agente</h2>
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
                      name="buscaAgente"
                      placeholder="Nome ou Número"
                      className="formFiltroAgente form-control"
                      id="buscaAgente"
                      value={searchAgente}
                      onChange={onChangeBuscaAgente}
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
                {tabelaAgentes ? (
                  <Tooltip title="Novo agente" placement="bottom" arrow>
                    <div>
                      <BsFillPersonPlusFill size={25} onClick={ativaCadastroAgente} className="iconNavegacao" />
                    </div>
                  </Tooltip>
                ) : (
                  <Tooltip title="Voltar a consulta" placement="bottom" arrow>
                    <div>
                      <BiArrowBack
                        size={25}
                        onClick={() => [setTabelaAgentes(true), setCadastraAgente(false)]}
                        className="iconNavegacao"
                      />
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          {tabelaAgentes && (
            <div className="tabelaAgentes container">
              <Table striped bordered>
                <thead>
                  <tr>
                    <th className="numeroTabela">
                      Número
                      {iconOrdenaNumero ? (
                        <RiArrowDownSLine
                          size={20}
                          className="iconOrdenacao"
                          onClick={() => [
                            filterSearchAgente.sort((a, b) => {
                              if (a.numero < b.numero) return -1
                              if (a.numero > b.numero) return 1
                              return 0
                            }),
                            setIconOrdenaNumero(false)
                          ]}
                        />
                      ) : (
                        <RiArrowUpSLine
                          size={20}
                          className="iconOrdenacao"
                          onClick={() => [
                            filterSearchAgente.sort((a, b) => {
                              if (a.numero < b.numero) return 1
                              if (a.numero > b.numero) return -1
                              return 0
                            }),
                            setIconOrdenaNumero(true)
                          ]}
                        />
                      )}
                    </th>
                    <th className="nomeTabela">
                      <span>
                        Nome
                        {iconOrdenaNome ? (
                          <RiArrowDownSLine
                            size={20}
                            className="iconOrdenacao"
                            onClick={() => [
                              filterSearchAgente.sort((a, b) => {
                                if (a.nome < b.nome) return -1
                                if (a.nome > b.nome) return 1
                                return 0
                              }),
                              setIconOrdenaNome(false)
                            ]}
                          />
                        ) : (
                          <RiArrowUpSLine
                            size={20}
                            className="iconOrdenacao"
                            onClick={() => [
                              filterSearchAgente.sort((a, b) => {
                                if (a.nome < b.nome) return 1
                                if (a.nome > b.nome) return -1
                                return 0
                              }),
                              setIconOrdenaNome(true)
                            ]}
                          />
                        )}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentAgentes.map((dado, valor) => {
                    const anoData = dado.dataInativo?.slice(0, 4)
                    const mesData = dado.dataInativo?.slice(5, 7)
                    const diaData = dado.dataInativo?.slice(8, 10)

                    const data = `${diaData}/${mesData}/${anoData}`
                    const dataFinal = data === 'undefined/undefined/undefined' ? null : data

                    return (
                      <tr key={dado.id} className="linhaAgentes">
                        <td className="numeroTabela">
                          <div className={`${dataFinal === null ? 'textNomeAgente' : 'textNomeAgenteInativo'}`}>
                            {dado.numero}
                          </div>
                        </td>
                        <td
                          className="nomeAgentes"
                          onMouseEnter={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                          onMouseLeave={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                          onClick={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                        >
                          <div className={`${dataFinal === null ? 'textNomeAgente' : 'textNomeAgenteInativo'}`}>
                            {dado.nome}
                          </div>

                          {showIcon[valor] && (
                            <div className="iconsModificacao">
                              <Tooltip title="Editar" placement="top" arrow>
                                <div>
                                  <FaRegEdit size={30} className="iconEdit" onClick={mostraEdicao(valor)} />
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
                            <ModalEdicaoAgente
                              show={!!showModalEdit}
                              onHide={() => [setShowModalEdit(false), setShowIcon(false)]}
                              onClick={() => setShowModalEdit(false)}
                              textbutton="Salvar"
                              textbutton2="Cancelar"
                              numero={dado.numero}
                              nome={dado.nome}
                              cpf={dado.cpf}
                              corporacao={dado.corporacao.id}
                              id={dado.id}
                            />
                          </td>
                        )}

                        {showModalInvalid[valor] && (
                          <td className="modalInvalid">
                            <ModalInativacaoAgente
                              show={!!showModalInvalid}
                              onHide={() => [setShowModalInvalid(false), setShowIcon(false)]}
                              onClick={() => setShowModalInvalid(false)}
                              textbutton="Inativar"
                              textbutton2="Cancelar"
                              nome={dado.nome}
                              id={dado.id}
                            />
                          </td>
                        )}

                        {showModalReative[valor] && (
                          <td className="modalInvalid">
                            <ModalReativacaoAgente
                              show={!!showModalReative}
                              onHide={() => [setShowModalReative(false), setShowIcon(false)]}
                              onClick={() => setShowModalReative(false)}
                              textbutton="Reativar"
                              textbutton2="Cancelar"
                              nome={dado.nome}
                              id={dado.id}
                            />
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </Table>

              <div className="paginacao container">
                <Pagination>
                  <Pagination.First onClick={() => setCurrentPage(0)} />
                  <Pagination.Prev
                    onClick={currentPage === 0 ? () => setCurrentPage(0) : () => setCurrentPage(currentPage - 1)}
                  />
                  <Pagination.Item active>{currentPage + 1}</Pagination.Item>

                  {currentPage >= 0 && currentPage <= pages - 1 && (
                    <>
                      {currentPage === pages - 1 ? null : currentPage === pages - 2 ? (
                        <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>
                          {currentPage + 2}
                        </Pagination.Item>
                      ) : currentPage === pages - 3 ? (
                        <>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>
                            {currentPage + 2}
                          </Pagination.Item>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)}>
                            {currentPage + 3}
                          </Pagination.Item>
                        </>
                      ) : currentPage === pages - 4 ? (
                        <>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>
                            {currentPage + 2}
                          </Pagination.Item>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)}>
                            {currentPage + 3}
                          </Pagination.Item>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 3)}>
                            {currentPage + 4}
                          </Pagination.Item>
                        </>
                      ) : currentPage === pages - 5 ? (
                        <>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>
                            {currentPage + 2}
                          </Pagination.Item>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)}>
                            {currentPage + 3}
                          </Pagination.Item>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 3)}>
                            {currentPage + 4}
                          </Pagination.Item>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 4)}>
                            {currentPage + 5}
                          </Pagination.Item>
                        </>
                      ) : (
                        <>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>
                            {currentPage + 2}
                          </Pagination.Item>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)}>
                            {currentPage + 3}
                          </Pagination.Item>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 3)}>
                            {currentPage + 4}
                          </Pagination.Item>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 4)}>
                            {currentPage + 5}
                          </Pagination.Item>
                          <Pagination.Item onClick={() => setCurrentPage(currentPage + 5)}>
                            {currentPage + 6}
                          </Pagination.Item>
                        </>
                      )}
                    </>
                  )}

                  <Pagination.Ellipsis />
                  <Pagination.Item onClick={() => setCurrentPage(pages)}>{pages + 1}</Pagination.Item>
                  <Pagination.Next
                    onClick={
                      currentPage === pages ? () => setCurrentPage(pages) : () => setCurrentPage(currentPage + 1)
                    }
                  />
                  <Pagination.Last onClick={() => setCurrentPage(pages)} />
                </Pagination>
              </div>
            </div>
          )}

          {cadastraAgente && (
            <div className="cadastro novoUsuario">
              <form className="criaUsuario mb-4" onSubmit={handleSubmit(formCriaAgente)} autoComplete="off">
                <div className="subtitulo mb-2">
                  <h6 className="mt-1">Cadastrar novo agente</h6>
                </div>

                <div className="formCriaUsuario">
                  <div className="labelForm col-12 col-md-5">
                    <input
                      type="text"
                      className="form-control"
                      name="nomeAgente"
                      id="nomeAgente"
                      placeholder="Nome"
                      {...register('nomeAgente')}
                      onChange={(e) => setNomeAgente(e.target.value)}
                      value={nomeAgente}
                    />
                    <label htmlFor="nomeAgente">Nome</label>
                    {errors?.nomeAgente?.type && nomeAgente.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-12 col-md-5">
                    <input
                      type="text"
                      name="cpfAgente"
                      id="cpfAgente"
                      className="form-control"
                      placeholder="CPF"
                      {...register('cpfAgente')}
                      value={cpfAgenteValue}
                      onChange={inputCpfAgenteMask}
                    />
                    <label htmlFor="cpfAgente"> CPF </label>
                    {errors?.cpfAgente?.type && cpfAgenteValue.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-12 col-md-3">
                    <input
                      type="text"
                      name="numeroAgente"
                      id="numeroAgente"
                      className="form-control"
                      placeholder="Número"
                      {...register('numeroAgente')}
                      // value={cpfAgenteValue}
                      // onChange={inputCpfAgenteMask}
                    />
                    <label htmlFor="numeroAgente"> Número </label>
                    {errors?.numeroAgente?.type && cpfAgenteValue.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-12 col-md-7 mb-3">
                    <select
                      name="corporacao"
                      className="col-12"
                      defaultValue="SELECIONE A CORPORAÇÃO"
                      {...register('corporacao')}
                    >
                      <option disabled>SELECIONE A CORPORAÇÃO</option>
                      {Corporacao.map((dado) => (
                        <option key={dado.id} value={dado.id}>
                          {dado.descricao}
                        </option>
                      ))}
                    </select>
                    {errors?.corporacao?.type && <ErrorForm />}
                  </div>

                  <div className="buttonCriaUsuario col-12">
                    <ButtonSubmit text="Cadastrar" />
                  </div>

                  {successAgente && (
                    <ModalMessage
                      title={[messageSuccessAgente]}
                      className="modalSuccess"
                      show={modalSuccessAgenteShow}
                      onHide={() => [setModalSuccessAgenteShow(false), reset()]}
                      textbutton="Voltar ao registro de Agente"
                      textbutton2="Ir para o ínicio"
                    />
                  )}

                  {falhaAgente && (
                    <ModalMessage
                      title={[messageFalhaAgente]}
                      className="modalFalha"
                      show={modalFalhaAgenteShow}
                      onHide={() => setModalFalhaAgenteShow(false)}
                      textbutton="Tentar novamente"
                      textbutton2="Ir para o ínicio"
                    />
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CriaAgente
