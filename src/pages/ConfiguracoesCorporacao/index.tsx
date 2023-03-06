import './ConfiguracoesCorporacao.css'
import Tooltip from '@mui/material/Tooltip'
import React, { useContext, useEffect, useState /* , useRef */ } from 'react'
import Table from 'react-bootstrap/Table'
import { useForm } from 'react-hook-form'
import { BiArrowBack } from 'react-icons/bi'
import { BsSearch } from 'react-icons/bs'
import { MdAddBusiness, MdContentPasteOff, MdBusiness } from 'react-icons/md'

import ButtonSubmit from '../../components/ButtonSubmit'
import ModalInativacaoCorporacao from '../../components/ModalInativaCorporacao'
import ModalMessage from '../../components/ModalMessage'
import ModalReativacaoCorporacao from '../../components/ModalReativaCorporacao'
import SideBar from '../../components/SideBarLateral'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'
import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'

function ConfiguracoesCorporacao() {
  const { classSideNav } = useContext(CondicionaisFormContext)

  const [cadastraAgente, setCadastraAgente] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [tabelaAgentes, setTabelaAgentes] = useState(true)

  function ativaCadastroAgente() {
    setCadastraAgente(true)
    setTabelaAgentes(false)
    setSearchActive(false)
  }

  function ativaPesquisa() {
    setSearchActive(!searchActive)
    setTabelaAgentes(true)
    setCadastraAgente(false)
  }

  const { Corporacao, atualizaCorporacao } = useContext(DadosContext)

  const [successEditCorporacao, setSuccessEditCorporacao] = useState(false)
  const [modalSuccessEditCorporacaoShow, setModalSuccessEditCorporacaoShow] = useState(false)
  const [messageSuccessEditCorporacao, setMessageSuccessEditCorporacao] = useState('')
  const [falhaEditCorporacao, setFalhaEditCorporacao] = useState(false)
  const [modalFalhaEditCorporacaoShow, setModalFalhaEditCorporacaoShow] = useState(false)
  const [messageFalhaEditCorporacao, setMessageFalhaEditCorporacao] = useState('')

  function submitCadastroCorporacao() {
    setNomeCorporacao('')
    setSuccessEditCorporacao(true)
    setModalSuccessEditCorporacaoShow(true)
  }

  const { register, handleSubmit, reset } = useForm()

  const formCriaCorporacao = (data) => {
    const dadosCorporacao = {
      descricao: data.nomeCorporacao
    }

    api
      .post('Corporacao', dadosCorporacao)

      .then((response) => {
        if (response.status === 200) {
          setMessageSuccessEditCorporacao(response.data.message)
          submitCadastroCorporacao()
          atualizaCorporacao()
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          setMessageFalhaEditCorporacao(error.response.data.message)
          setFalhaEditCorporacao(true)
          setModalFalhaEditCorporacaoShow(true)
        }
      })
  }

  const [nomeCorporacao, setNomeCorporacao] = useState('')

  const [searchCorporacao, setSearchCorporacao] = useState('')
  const [filterSearchCorporacao, setFilterSearchCorporacao] = useState([])
  const [filterAtivas, setFilterAtivas] = useState([])
  const [filterInativas, setFilterInativas] = useState([])

  useEffect(() => {
    setFilterSearchCorporacao(Corporacao)
  }, [Corporacao])

  const [filterGeralCorporacao, setFilterGeralCorporacao] = useState('Todas')

  useEffect(() => {
    if (filterGeralCorporacao === 'Todas') {
      const FiltroGeral = Corporacao
      setFilterSearchCorporacao(FiltroGeral)
    } else if (filterGeralCorporacao === 'Ativas') {
      const FiltroGeral = Corporacao.filter((value) => !value.dataInativo)
      setFilterAtivas(FiltroGeral)
      setFilterSearchCorporacao(FiltroGeral)
    } else if (filterGeralCorporacao === 'Inativas') {
      const FiltroGeral = Corporacao.filter((value) => value.dataInativo)
      setFilterInativas(FiltroGeral)
      setFilterSearchCorporacao(FiltroGeral)
    }
  }, [filterGeralCorporacao, Corporacao])

  const onChangeBuscaCorporacao = (e) => {
    e.preventDefault()
    setSearchCorporacao(e.target.value)

    if (filterGeralCorporacao === 'Todas') {
      const Filtro = Corporacao.filter((value) => value.descricao.toLowerCase().includes(e.target.value.toLowerCase()))

      setFilterSearchCorporacao(Filtro)
    } else if (filterGeralCorporacao === 'Ativas') {
      const Filtro = filterAtivas.filter((value) =>
        value.descricao.toLowerCase().includes(e.target.value.toLowerCase())
      )

      setFilterSearchCorporacao(Filtro)
    } else if (filterGeralCorporacao === 'Inativas') {
      const Filtro = filterInativas.filter((value) =>
        value.descricao.toLowerCase().includes(e.target.value.toLowerCase())
      )

      setFilterSearchCorporacao(Filtro)
    }
  }

  useEffect(() => {
    if (searchCorporacao.length > 0) {
      ativaPesquisa()
    }
    // eslint-disable-next-line
  }, [searchCorporacao])

  const [showIcon, setShowIcon] = useState({})

  const mostraIcon = (valor) => () => {
    setShowIcon((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const [showModalInvalid, setShowModalInvalid] = useState({})
  const [showModalReative, setShowModalReative] = useState({})

  const mostraInativacao = (valor: number) => () => {
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

  const [messageDataInativo, setMessageDataInativo] = useState({})

  const ativaMessageDataInativo = (valor) => () => {
    setMessageDataInativo((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  return (
    <div className="content">
      <div className="sideNavLateral">
        <SideBar />
      </div>

      <div className={`${classSideNav === 'sidenav' ? 'conteudoComSidenav' : 'conteudoSemSidenav'}`}>
        <div className="container mt-3">
          <h2>Configurações de Corporação</h2>
          <div className="menuNavegacao mb-2">
            <div className="iconsMenu">
              <div className="pesquisaTabela">
                <form>
                  <div className="labelFiltroAgente">
                    <select
                      defaultValue={filterGeralCorporacao}
                      onChange={(e) => setFilterGeralCorporacao(e.target.value)}
                    >
                      <option>Todas</option>
                      <option>Ativas</option>
                      <option>Inativas</option>
                    </select>

                    <input
                      type="text"
                      name="buscaAgente"
                      placeholder="Pesquisar corporação"
                      className="formFiltroAgente form-control"
                      id="buscaAgente"
                      value={searchCorporacao}
                      onChange={onChangeBuscaCorporacao}
                    />

                    <div className="iconBusca">
                      <Tooltip title="Pesquisar" placement="bottom" arrow>
                        <div>
                          <BsSearch size={25} onClick={ativaPesquisa} color="white" />
                        </div>
                      </Tooltip>
                    </div>

                    {/* <Tooltip title="Registros por página" placement="bottom" arrow>
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
                    </Tooltip> */}
                  </div>
                </form>
              </div>

              <div className="itemMenuNavegacao">
                {tabelaAgentes ? (
                  <Tooltip title="Nova corporação" placement="bottom" arrow>
                    <div>
                      <MdAddBusiness size={25} onClick={ativaCadastroAgente} className="iconNavegacao" />
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
                    <th className="nomeTabela">
                      <span>Nome da corporação</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filterSearchCorporacao.map((dado, valor) => {
                    const anoData = dado.dataInativo?.slice(0, 4)
                    const mesData = dado.dataInativo?.slice(5, 7)
                    const diaData = dado.dataInativo?.slice(8, 10)

                    const data = `${diaData}/${mesData}/${anoData}`
                    const dataFinal = data === 'undefined/undefined/undefined' ? null : data

                    return (
                      <tr key={dado.id} className="linhaAgentes">
                        <td
                          className="nomeAgentes"
                          onMouseEnter={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                          onMouseLeave={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                          onClick={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                        >
                          <div className={`${dataFinal === null ? 'textNomeAgente' : 'textNomeAgenteInativo'}`}>
                            {dado.descricao}
                          </div>

                          {showIcon[valor] && dado.dataInativo === null && (
                            <Tooltip title="Inativar" placement="top" arrow>
                              <div>
                                <MdContentPasteOff
                                  size={32}
                                  className="iconInative"
                                  onClick={mostraInativacao(valor)}
                                />
                              </div>
                            </Tooltip>
                          )}

                          {messageDataInativo[valor] && (
                            <div className="reativaAgente">
                              <span className="messageInativo">Inativado em: {dataFinal}</span>
                              <Tooltip title="Reativar" placement="top" arrow>
                                <div>
                                  <MdBusiness size={32} className="iconReativar" onClick={mostraReativacao(valor)} />
                                </div>
                              </Tooltip>
                            </div>
                          )}
                        </td>

                        {showModalInvalid[valor] && (
                          <td className="modalInvalid">
                            <ModalInativacaoCorporacao
                              show={!!showModalInvalid}
                              onHide={() => [setShowModalInvalid(false), setShowIcon(false)]}
                              onClick={() => setShowModalInvalid(false)}
                              textbutton="Inativar"
                              textbutton2="Cancelar"
                              nome={dado.descricao}
                              id={dado.id}
                            />
                          </td>
                        )}

                        {showModalReative[valor] && (
                          <td className="modalInvalid">
                            <ModalReativacaoCorporacao
                              show={!!showModalReative}
                              onHide={() => [setShowModalReative(false), setShowIcon(false)]}
                              onClick={() => setShowModalReative(false)}
                              textbutton="Reativar"
                              textbutton2="Cancelar"
                              nome={dado.descricao}
                              id={dado.id}
                            />
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          )}

          {cadastraAgente && (
            <div className="cadastro novoUsuario">
              <form className="criaUsuario mb-4" onSubmit={handleSubmit(formCriaCorporacao)} autoComplete="off">
                <div className="subtitulo mb-2">
                  <h6 className="mt-1">Cadastrar nova corporação</h6>
                </div>

                <div className="formCriaUsuario">
                  <div className="labelForm col-12">
                    <input
                      type="text"
                      className="form-control"
                      name="nomeCorporacao"
                      id="nomeCorporacao"
                      placeholder="Nome"
                      {...register('nomeCorporacao')}
                      onChange={(e) => setNomeCorporacao(e.target.value)}
                      value={nomeCorporacao}
                    />
                    <label htmlFor="nomeAgente">Nome</label>
                  </div>

                  <div className="buttonCriaUsuario col-12">
                    <ButtonSubmit type="submit" onClick={handleSubmit(formCriaCorporacao)} text="Cadastrar" />
                  </div>

                  {successEditCorporacao && (
                    <ModalMessage
                      title={[messageSuccessEditCorporacao]}
                      className="modalSuccess"
                      show={modalSuccessEditCorporacaoShow}
                      onHide={() => [setSuccessEditCorporacao(false), reset()]}
                      textbutton="Voltar ao registro de Corporação"
                      textbutton2="Ir para o ínicio"
                    />
                  )}

                  {falhaEditCorporacao && (
                    <ModalMessage
                      title={[messageFalhaEditCorporacao]}
                      className="modalFalha"
                      show={modalFalhaEditCorporacaoShow}
                      onHide={() => setFalhaEditCorporacao(false)}
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

export default ConfiguracoesCorporacao
