/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import-helpers/order-imports */
// eslint-disable-next-line import/order
import { DadosContext } from '../../contexts/DadosContext'
import './listagemEnquadramentos.css'
import { BsSearch } from 'react-icons/bs'
import Table from 'react-bootstrap/Table'
import Tooltip from '@mui/material/Tooltip'
import React, { useContext, useEffect, useState } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'
import SideBar from '../../components/SideBarLateral'
import { AuthContext } from '../../contexts/AuthContext'

function ListagemEnquadramentos() {
  const { classSideNav } = useContext(CondicionaisFormContext)

  const { Permissoes } = useContext(AuthContext)

  const { Enquadramento, ModalidadeServico, valorUnidadeFinanceira, nomeUnidadeFinanceira } = useContext(DadosContext)

  const [searchEnquadramento, setSearchEnquadramento] = useState('')
  const [filterSearchEnquadramento, setFilterSearchEnquadramento] = useState([])
  const [filterEstrutural, setFilterEstrutural] = useState([])
  const [filterEscolar, setFilterEscolar] = useState([])
  const [filterTaxi, setFilterTaxi] = useState([])
  const [filterMotoFrete, setFilterMotoFrete] = useState([])
  const [filterClandestino, setFilterClandestino] = useState([])

  useEffect(() => {
    setFilterSearchEnquadramento(Enquadramento)
  }, [Enquadramento])

  const [filterGeral, setFilterGeral] = useState('Todos')

  useEffect(() => {
    setCurrentPage(0)

    if (filterGeral === 'Todos') {
      const FiltroGeral = Enquadramento
      setFilterSearchEnquadramento(FiltroGeral)
    } else if (filterGeral === 'Estrutural') {
      const FiltroGeral = Enquadramento.filter((value) => value.servico.descricao === 'Estrutural')
      setFilterEstrutural(FiltroGeral)
      setFilterSearchEnquadramento(FiltroGeral)
    } else if (filterGeral === 'Escolar') {
      const FiltroGeral = Enquadramento.filter((value) => value.servico.descricao === 'Escolar')
      setFilterEscolar(FiltroGeral)
      setFilterSearchEnquadramento(FiltroGeral)
    } else if (filterGeral === 'Táxi') {
      const FiltroGeral = Enquadramento.filter((value) => value.servico.descricao === 'Táxi')
      setFilterTaxi(FiltroGeral)
      setFilterSearchEnquadramento(FiltroGeral)
    } else if (filterGeral === 'Moto-frete') {
      const FiltroGeral = Enquadramento.filter((value) => value.servico.descricao === 'Moto-frete')
      setFilterMotoFrete(FiltroGeral)
      setFilterSearchEnquadramento(FiltroGeral)
    } else if (filterGeral === 'Clandestino') {
      const FiltroGeral = Enquadramento.filter((value) => value.servico.descricao === 'Clandestino')
      setFilterClandestino(FiltroGeral)
      setFilterSearchEnquadramento(FiltroGeral)
    }
  }, [filterGeral, Enquadramento])

  const onChangeBuscaEnquadramento = (e) => {
    e.preventDefault()
    setSearchEnquadramento(e.target.value)

    if (filterGeral === 'Todos') {
      const Filtro = Enquadramento.filter(
        (value) =>
          value.descricao?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.grupo?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.codigo?.toString().includes(e.target.value)
      )

      setFilterSearchEnquadramento(Filtro)
    } else if (filterGeral === 'Estrutural') {
      const Filtro = filterEstrutural.filter(
        (value) =>
          value.descricao?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.grupo?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.codigo?.toString().includes(e.target.value)
      )

      setFilterSearchEnquadramento(Filtro)
    } else if (filterGeral === 'Escolar') {
      const Filtro = filterEscolar.filter(
        (value) =>
          value.descricao?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.grupo?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.codigo?.toString().includes(e.target.value)
      )

      setFilterSearchEnquadramento(Filtro)
    } else if (filterGeral === 'Táxi') {
      const Filtro = filterTaxi.filter(
        (value) =>
          value.descricao?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.grupo?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.codigo?.toString().includes(e.target.value)
      )

      setFilterSearchEnquadramento(Filtro)
    } else if (filterGeral === 'Moto-frete') {
      const Filtro = filterMotoFrete.filter(
        (value) =>
          value.descricao?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.grupo?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.codigo?.toString().includes(e.target.value)
      )

      setFilterSearchEnquadramento(Filtro)
    } else if (filterGeral === 'Clandestino') {
      const Filtro = filterClandestino.filter(
        (value) =>
          value.descricao?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.grupo?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.codigo?.toString().includes(e.target.value)
      )

      setFilterSearchEnquadramento(Filtro)
    }
  }

  const [linhasPerPage, setLinhasPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(0)

  const pages = Math.ceil(filterSearchEnquadramento.length / linhasPerPage - 1)
  const startIndex = currentPage * linhasPerPage
  const endIndex = startIndex + linhasPerPage
  const currentEnquadramentos = filterSearchEnquadramento.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(0)
  }, [linhasPerPage])

  const [iconOrdenaNumero, setIconOrdenaNumero] = useState(true)
  const [iconOrdenaNome, setIconOrdenaNome] = useState(true)

  const [showIcon, setShowIcon] = useState({})

  const mostraIcon = (valor) => () => {
    setShowIcon((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const [showDetailsEnquadramento, setShowDetailsEnquadramento] = useState({})

  const mostraDetalhesEnquadramento = (valor) => () => {
    setShowDetailsEnquadramento((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  return (
    <div className="content">
      {Permissoes.toString() === 'Administrador' && (
        <div className="sideNavLateral">
          <SideBar />
        </div>
      )}

      <div className={`${classSideNav === 'sidenav' ? 'conteudoComSidenav' : 'conteudoSemSidenav'}`}>
        <div className="listagemEnquadramentos container mt-3">
          <h2>Tabela de Enquadramentos</h2>
          <div className="menuNavegacao mb-2">
            <div className="iconsMenu">
              <div className="pesquisaTabela">
                <form>
                  <div className="labelFiltroAgente">
                    <select defaultValue={filterGeral} onChange={(e) => setFilterGeral(e.target.value)}>
                      <option>Todos</option>
                      {ModalidadeServico.map((dado) => (
                        <option key={dado.id} value={dado.descricao}>
                          {dado.descricao}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      name="buscaCorporacao"
                      placeholder="Código, grupo ou descrição"
                      className="formFiltroAgente form-control"
                      id="buscaCorporacao"
                      value={searchEnquadramento}
                      onChange={onChangeBuscaEnquadramento}
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
            </div>
          </div>

          <div className="tabelaAgentes container">
            <Table striped bordered>
              <thead>
                <tr>
                  <th className="headerTabela">
                    Código
                    {iconOrdenaNumero ? (
                      <RiArrowDownSLine
                        size={20}
                        className="iconOrdenacao col-2"
                        onClick={() => [
                          filterSearchEnquadramento.sort((a, b) => {
                            if (a.codigo < b.codigo) return -1
                            if (a.codigo > b.codigo) return 1
                            return 0
                          }),
                          setIconOrdenaNumero(false)
                        ]}
                      />
                    ) : (
                      <RiArrowUpSLine
                        size={20}
                        className="iconOrdenacao col-2"
                        onClick={() => [
                          filterSearchEnquadramento.sort((a, b) => {
                            if (a.codigo < b.codigo) return 1
                            if (a.codigo > b.codigo) return -1
                            return 0
                          }),
                          setIconOrdenaNumero(true)
                        ]}
                      />
                    )}
                  </th>
                  <th className="headerTabela">
                    <span>
                      Grupo
                      {iconOrdenaNome ? (
                        <RiArrowDownSLine
                          size={20}
                          className="iconOrdenacao col-2"
                          onClick={() => [
                            filterSearchEnquadramento.sort((a, b) => {
                              if (a.grupo < b.grupo) return -1
                              if (a.grupo > b.grupo) return 1
                              return 0
                            }),
                            setIconOrdenaNome(false)
                          ]}
                        />
                      ) : (
                        <RiArrowUpSLine
                          size={20}
                          className="iconOrdenacao col-2"
                          onClick={() => [
                            filterSearchEnquadramento.sort((a, b) => {
                              if (a.grupo < b.grupo) return 1
                              if (a.grupo > b.grupo) return -1
                              return 0
                            }),
                            setIconOrdenaNome(true)
                          ]}
                        />
                      )}
                    </span>
                  </th>

                  <th className="headerTabela">
                    <span>Tipo de serviço</span>
                  </th>

                  <th className="lastHeaderTabela">
                    <span>Descrição</span>
                  </th>
                </tr>
              </thead>
              {currentEnquadramentos.map((dado, valor) => {
                const descricaoResumida = dado.descricao.slice(0, 50)

                return (
                  <tbody key={dado.id}>
                    <tr className="linhaAgentes" onMouseEnter={mostraIcon(valor)} onMouseLeave={mostraIcon(valor)}>
                      <td className="dadoTabelaCodigo">
                        <div className="textNomeAgente">{dado.codigo}</div>
                      </td>

                      <td className="dadoTabela">
                        <div className="textNomeAgente">{dado.grupo}</div>
                      </td>

                      <td className="dadoTabela">
                        <div className="textNomeAgente">{dado.servico.descricao}</div>
                      </td>

                      <td className="dadoTabelaDescricao">
                        <div className="textDescricaoEnquadramento">
                          {dado.descricao.length >= 50 ? `${descricaoResumida}...` : dado.descricao}
                        </div>

                        {showIcon[valor] && (
                          <div className="iconeExpandeInfracao">
                            <RiArrowDownSLine size={20} onClick={mostraDetalhesEnquadramento(valor)} />
                          </div>
                        )}
                      </td>
                    </tr>

                    {showDetailsEnquadramento[valor] && (
                      <tr>
                        <td className="" colSpan={4}>
                          <div className="detalhesEnquadramento">
                            <h6 className="titleDetailsEnquadramento container">Detalhes do enquadramento:</h6>
                            <ul className="listaDetalhesEnquadramento">
                              <li>
                                <span className="itemListaDetalhesEnquadramento">- Descrição:</span>
                                {` ${dado.descricao}`}
                              </li>

                              <li>
                                <span className="itemListaDetalhesEnquadramento">- Valor unitário:</span>
                                {` R$ ${dado.unidade * valorUnidadeFinanceira} 
                                        [${dado.unidade} 
                                        ${nomeUnidadeFinanceira} 
                                        x R$ ${valorUnidadeFinanceira}]`}
                              </li>

                              {dado.medidasAdministrativas.length !== 0 && (
                                <li>
                                  <span className="itemListaDetalhesEnquadramento">- Medidas administrativas:</span>
                                  {dado.medidasAdministrativas.map((medidas) => (
                                    <ul key={medidas.id} className="listaMedidasAdministrativas">
                                      <li>- {medidas.descricao}</li>
                                    </ul>
                                  ))}
                                </li>
                              )}

                              {dado.tipoGravidade.descricao !== 'N/A' && (
                                <li className="mt-1">
                                  <span className="itemListaDetalhesEnquadramento">- Tipo de gravidade:</span>
                                  {` ${dado.tipoGravidade.descricao}`}
                                </li>
                              )}

                              {dado.penalidade !== '' && (
                                <li className="mt-1">
                                  <span className="itemListaDetalhesEnquadramento">- Penalidade:</span>
                                  {` ${dado.penalidade}`}
                                </li>
                              )}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )
              })}
            </Table>
          </div>
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
                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 2}</Pagination.Item>
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
                onClick={currentPage === pages ? () => setCurrentPage(pages) : () => setCurrentPage(currentPage + 1)}
              />
              <Pagination.Last onClick={() => setCurrentPage(pages)} />
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListagemEnquadramentos
