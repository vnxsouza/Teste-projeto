/* eslint-disable import-helpers/order-imports */
/* eslint-disable jsx-a11y/control-has-associated-label */
import Tooltip from '@mui/material/Tooltip'
import React, { useContext, useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import { FaFilePdf, FaFileWord, FaFileCsv, FaFileExcel, FaFileArchive } from 'react-icons/fa'

import './ControleDeTalao.css'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { MdOutlineLocalPostOffice, MdOutlineFilterList } from 'react-icons/md'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'

import ButtonSubmit from '../../components/ButtonSubmit'
import ModalMessage from '../../components/ModalMessage'
import SideBar from '../../components/SideBarLateral'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'
import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'

function ControleDeTalao() {
  const { classSideNav } = useContext(CondicionaisFormContext)

  const { lotesGerados, atualizaLotesGerados, tiposRelatorio } = useContext(DadosContext)

  const [showIcon, setShowIcon] = useState({})

  const mostraIcon = (valor) => () => {
    setShowIcon((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const [showDetailsInfracao, setShowDetailsInfracao] = useState({})

  const mostraDetalhesInfracao = (valor) => () => {
    setShowDetailsInfracao((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const statusInfracoes = [
    {
      id: 1,
      status: 'Gerada'
    },
    {
      id: 2,
      status: 'Postada'
    }
  ]

  const [filterInfracoes, setFilterInfracoes] = useState([])

  useEffect(() => {
    setFilterInfracoes(lotesGerados)
  }, [lotesGerados])

  const [divOptionsFilter, setDivOptionsFilter] = useState(false)

  function ativaOptionsFilters() {
    setDivOptionsFilter(!divOptionsFilter)
  }

  const [valueTipoNotificacao, setValueTipoNotificacao] = useState('Autuação')
  const [filterStatusNotificacao, setFilterStatusNotificacao] = useState('Status do lote')

  useEffect(() => {
    if (filterStatusNotificacao === 'Todos') {
      setFilterInfracoes(lotesGerados)
    } else if (filterStatusNotificacao === 'Postados') {
      const lotesFiltrados = lotesGerados.filter((value) => value.tipoStatusLote.descricao === 'Postado')
      setFilterInfracoes(lotesFiltrados)
    } else if (filterStatusNotificacao === 'Não postados') {
      const lotesFiltrados = lotesGerados.filter((value) => value.tipoStatusLote.descricao === 'Gerado')
      setFilterInfracoes(lotesFiltrados)
    }
  }, [filterStatusNotificacao, lotesGerados])

  useEffect(() => {
    if (valueTipoNotificacao === 'Autuação') {
      const lotesFiltrados = lotesGerados.filter((value) => value.tipoNotificacao.descricao === 'Autuação')
      setFilterInfracoes(lotesFiltrados)
    }
    // else if (valueTipoNotificacao === 'Penalidade') {
    //   const lotesFiltrados = lotesGerados.filter((value) => value.tipoNotificacao.descricao === 'Penalidade')
    //   setFilterInfracoes(lotesFiltrados)
    // } else if (valueTipoNotificacao === 'Tipo de recurso') {
    //   const lotesFiltrados = lotesGerados.filter((value) => value.tipoNotificacao.descricao === 'Resultado de recurso')
    //   setFilterInfracoes(lotesFiltrados)
    // }
  }, [valueTipoNotificacao, lotesGerados])

  const [iconOrdenaNumero, setIconOrdenaNumero] = useState(true)
  const [iconOrdenaData, setIconOrdenaData] = useState(true)
  const [iconOrdenaDataLimite, setIconOrdenaDataLimite] = useState(true)

  const [infosPostagemActive, setInfosPostagemActive] = useState({})

  function ativaInfosPostagem(valor) {
    setInfosPostagemActive((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const [successLoteBaixado, setSuccessLoteBaixado] = useState(false)
  const [modalSuccessLoteBaixado, setModalSuccessLoteBaixado] = useState(false)
  const [successLotePostado, setSuccessLotePostado] = useState(false)
  const [modalSuccessLotePostado, setModalSuccessLotePostado] = useState(false)
  const [messageLotePostado, setMessageLotePostado] = useState('')

  function loteBaixado() {
    setSuccessLoteBaixado(true)
    setModalSuccessLoteBaixado(true)
  }

  const [valueTipoRelatorio, setValueTipoRelatorio] = useState(2)

  function downloadLote(idArquivo) {
    api
      .post(`Notificacao/download-lote-infracao?arquivoId=${idArquivo}&tipoRelatorio=${valueTipoRelatorio}`, '', {
        responseType: 'arraybuffer'
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute(
          'download',
          valueTipoRelatorio === 0
            ? 'loteDeNotificacoes.zip'
            : valueTipoRelatorio === 1
            ? 'loteDeNotificacoes.csv'
            : valueTipoRelatorio === 2
            ? 'loteDeNotificacoes.pdf'
            : valueTipoRelatorio === 3
            ? 'loteDeNotificacoes.xls'
            : valueTipoRelatorio === 4
            ? 'loteDeNotificacoes.zip'
            : null
        )
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)

        loteBaixado()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const [dataPostagem, setDataPostagem] = useState('')
  const [codigoCorreios, setCodigoCorreios] = useState('')

  function lotePostado(arquivoId) {
    const atualizacaoLote = {
      arquivoId,
      dataPostagem,
      codigoCorreio: codigoCorreios
    }

    api
      .put('Postagem/atualiza-status-lote', atualizacaoLote)
      .then((response) => {
        setInfosPostagemActive(false)
        setMessageLotePostado(response.data.message)
        setSuccessLotePostado(true)
        setModalSuccessLotePostado(true)
        atualizaLotesGerados()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="content">
      <div className="sideNavLateral">
        <SideBar />
      </div>

      <div className={`${classSideNav === 'sidenav' ? 'conteudoComSidenav' : 'conteudoSemSidenav'}`}>
        <div className="controleNotificacoes container mt-3">
          <h2>Controle de lotes</h2>

          <form className="form mb-4">
            <div className="form-talao">
              <div className="headerPanelsInfracoes container mt-3">
                <div className="panelFilterInfracoes col-12">
                  <div className="tituloPanel mb-2">
                    <h6>Filtros</h6>
                    <MdOutlineFilterList size={20} color="white" />
                  </div>

                  <div className="filtrosInfracoes">
                    <div className="col-12 col-md-3 mb-1">
                      <select
                        className="col-12 mt-1"
                        value={filterStatusNotificacao}
                        onChange={(e) => setFilterStatusNotificacao(e.target.value)}
                      >
                        <option disabled>Status do lote</option>
                        <option>Todos</option>
                        <option>Postados</option>
                        <option>Não postados</option>
                      </select>
                    </div>

                    <div className="selectFilterInfracoes col-12 col-md-3">
                      <select
                        className="col-12"
                        value={valueTipoNotificacao}
                        onChange={(e) => setValueTipoNotificacao(e.target.value)}
                      >
                        <option disabled>Tipo de Notificação</option>
                        {/* <option value={1}>Todas</option> */}
                        <option>Autuação</option>
                        {/* <option>Penalidade</option>
                        <option>Tipo de recurso</option> */}
                      </select>
                    </div>

                    <div className="col-12 col-md-3">
                      <Tooltip title="Registros por página" placement="bottom" arrow>
                        <div>
                          <select defaultValue="Registros p/ página" className="col-12">
                            <option disabled>Registros p/ página</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={200}>200</option>
                          </select>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="tabelaAgentes container">
            <Table striped bordered>
              <thead>
                <tr>
                  <th className="colunaIconLotePostado" />
                  <th className="headerTabela">
                    <span>ID do lote</span>
                  </th>

                  <th className="headerTabela">
                    <span>Tipo de notificacão</span>
                  </th>

                  {/* <th className='nomeTabela'> */}
                  <th className="headerTabela">
                    <span>Data de emissão</span>
                    {iconOrdenaData ? (
                      <RiArrowDownSLine
                        size={20}
                        className="iconOrdenacao"
                        onClick={() => [
                          filterInfracoes.sort((a, b) => {
                            if (a.dataEmissao < b.dataEmissao) return -1
                            if (a.dataEmissao > b.dataEmissao) return 1
                            return 0
                          }),
                          setIconOrdenaData(false)
                        ]}
                      />
                    ) : (
                      <RiArrowUpSLine
                        size={20}
                        className="iconOrdenacao"
                        onClick={() => [
                          filterInfracoes.sort((a, b) => {
                            if (a.dataEmissao < b.dataEmissao) return 1
                            if (a.dataEmissao > b.dataEmissao) return -1
                            return 0
                          }),
                          setIconOrdenaData(true)
                        ]}
                      />
                    )}
                  </th>

                  <th className="headerTabela">
                    <span>Data limite</span>
                    {iconOrdenaDataLimite ? (
                      <RiArrowDownSLine
                        size={20}
                        className="iconOrdenacao"
                        onClick={() => [
                          filterInfracoes.sort((a, b) => {
                            if (a.dataLimiteProcesso < b.dataLimiteProcesso) return -1
                            if (a.dataLimiteProcesso > b.dataLimiteProcesso) return 1
                            return 0
                          }),
                          setIconOrdenaDataLimite(false)
                        ]}
                      />
                    ) : (
                      <RiArrowUpSLine
                        size={20}
                        className="iconOrdenacao"
                        onClick={() => [
                          filterInfracoes.sort((a, b) => {
                            if (a.dataLimiteProcesso < b.dataLimiteProcesso) return 1
                            if (a.dataLimiteProcesso > b.dataLimiteProcesso) return -1
                            return 0
                          }),
                          setIconOrdenaDataLimite(true)
                        ]}
                      />
                    )}
                  </th>

                  <th className="headerTabela">
                    <span>Qtd de infrações</span>
                    {iconOrdenaNumero ? (
                      <RiArrowDownSLine
                        size={20}
                        className="iconOrdenacao"
                        onClick={() => [
                          filterInfracoes.sort((a, b) => {
                            if (a.quantidadeRegistros < b.quantidadeRegistros) return -1
                            if (a.quantidadeRegistros > b.quantidadeRegistros) return 1
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
                          filterInfracoes.sort((a, b) => {
                            if (a.quantidadeRegistros < b.quantidadeRegistros) return 1
                            if (a.quantidadeRegistros > b.quantidadeRegistros) return -1
                            return 0
                          }),
                          setIconOrdenaNumero(true)
                        ]}
                      />
                    )}
                  </th>
                </tr>
              </thead>

              {filterInfracoes.map((dado, valor) => {
                const anoData = dado.dataEmissao.slice(0, 4)
                const mesData = dado.dataEmissao.slice(5, 7)
                const diaData = dado.dataEmissao.slice(8, 10)

                const dataEmissao = `${diaData}/${mesData}/${anoData}`

                const anoDataLimite = dado.dataLimiteProcesso.slice(0, 4)
                const mesDataLimite = dado.dataLimiteProcesso.slice(5, 7)
                const diaDataLimite = dado.dataLimiteProcesso.slice(8, 10)

                const dataLimite = `${diaDataLimite}/${mesDataLimite}/${anoDataLimite}`

                return (
                  <tbody key={dado.id}>
                    <tr className="linhaAgentes" onMouseEnter={mostraIcon(valor)} onMouseLeave={mostraIcon(valor)}>
                      <td className="colunaIconLotePostado">
                        {dado.tipoStatusLote.id === 2 && (
                          <Tooltip title="Lote postado" placement="bottom" arrow>
                            <div>
                              <MdOutlineLocalPostOffice className="iconLotePostado" size={20} />
                            </div>
                          </Tooltip>
                        )}
                      </td>

                      <td className="dadoTabela">
                        <span>{dado.id}</span>
                      </td>

                      <td className="dadoTabela">
                        <span>{dado.tipoNotificacao.descricao}</span>
                      </td>

                      <td className="dadoTabela">
                        <span>{dataEmissao}</span>
                      </td>

                      <td>{dataLimite}</td>

                      <td>
                        <div className="colunaExpandeInfracao">
                          <div className="nomeCondutor">{dado.quantidadeRegistros}</div>

                          {showIcon[valor] && (
                            <div className="iconeExpandeInfracao">
                              <RiArrowDownSLine size={20} onClick={mostraDetalhesInfracao(valor)} />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>

                    {showDetailsInfracao[valor] && (
                      <tr className="linhaDetailsInfracao">
                        <td colSpan={6}>
                          <div className="detailsInfracao">
                            {dado.tipoStatusLote.id === 1 && (
                              <div className="iconesExport container mb-4">
                                <div className="col-12">
                                  <div className="envioLote container mb-3 mt-3 col-12">
                                    <div className="tipoArquivoDetailsInfracao col-5 col-md-4">
                                      <div>
                                        <span>Tipo de arquivo:</span>
                                      </div>
                                      <select
                                        className="col-12"
                                        value={valueTipoRelatorio}
                                        onChange={(e) => setValueTipoRelatorio(Number(e.target.value))}
                                      >
                                        <option disabled>Tipo de arquivo</option>
                                        {tiposRelatorio.map((tipoArquivo) => (
                                          <option key={tipoArquivo.id} value={tipoArquivo.id}>
                                            {tipoArquivo.descricao.toUpperCase()}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="botaoGerarLote col-12 col-md-6">
                                      <div
                                        className="labelGerarLote col-5 col-md-12 mt-4"
                                        onClick={() => downloadLote(dado.id)}
                                      >
                                        <span className="textGerarLote">Gerar lote novamente</span>
                                        {valueTipoRelatorio === 0 ? (
                                          <FaFileWord size={18} />
                                        ) : valueTipoRelatorio === 1 ? (
                                          <FaFileCsv size={18} />
                                        ) : valueTipoRelatorio === 2 ? (
                                          <FaFilePdf size={18} />
                                        ) : valueTipoRelatorio === 3 ? (
                                          <FaFileExcel size={18} />
                                        ) : (
                                          <FaFileArchive size={18} />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {/* <div className="iconePdf" onClick={() => downloadLote(dado.id)}>
                                    <span>Gerar lote novamente </span>
                                    <FaFilePdf size={18} />
                                  </div> */}
                                </div>
                              </div>
                            )}

                            <div className="dadosCompletosInfracao mt-2 mb-2">
                              <div className="statusInfracao col-12">
                                <Stepper activeStep={dado.tipoStatusLote.id} alternativeLabel>
                                  {statusInfracoes.map((label) => (
                                    <Step key={label.id}>
                                      <Tooltip
                                        title={`${
                                          label.id === 2 && dado.tipoStatusLote.id === 1
                                            ? 'Identificar lote como postado'
                                            : ''
                                        }`}
                                        placement="top"
                                        arrow
                                      >
                                        <StepLabel
                                          onClick={
                                            label.id === 2 && dado.tipoStatusLote.id === 1
                                              ? () => ativaInfosPostagem(valor)
                                              : null
                                          }
                                          className={`${
                                            label.id === 2 && dado.tipoStatusLote.id === 1
                                              ? 'statusPostagem'
                                              : 'statusInfracao'
                                          }`}
                                        >
                                          {label.status}
                                        </StepLabel>
                                      </Tooltip>
                                    </Step>
                                  ))}
                                </Stepper>

                                {infosPostagemActive[valor] && dado.tipoStatusLote.id === 1 && (
                                  <div className="infosInfracaoPostada mt-3">
                                    <label className="data col-5 col-md-3">
                                      Data de postagem
                                      <input
                                        type="date"
                                        name="dataInfracao mb-3"
                                        id="data"
                                        className="form-control"
                                        value={dataPostagem}
                                        onChange={(e) => setDataPostagem(e.target.value)}
                                      />
                                    </label>

                                    <div className="labelForm col-5 col-md-3">
                                      <input
                                        type="text"
                                        name="codigoCorreios"
                                        id="codigoCorreios"
                                        className="form-control"
                                        placeholder="Código dos correios"
                                        value={codigoCorreios}
                                        onChange={(e) => setCodigoCorreios(e.target.value)}
                                      />
                                      <label htmlFor="codigoCorreios"> Código dos correios </label>
                                    </div>

                                    <div className="mt-2">
                                      <ButtonSubmit text="Confirmar" onClick={() => lotePostado(dado.id)} />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {successLoteBaixado && (
                              <ModalMessage
                                title={['Lote baixado com sucesso!']}
                                className="modalSuccess"
                                show={modalSuccessLoteBaixado}
                                onHide={() => setModalSuccessLoteBaixado(false)}
                                textbutton="OK"
                              />
                            )}

                            {successLotePostado && (
                              <ModalMessage
                                title={[messageLotePostado]}
                                className="modalSuccess"
                                show={modalSuccessLotePostado}
                                onHide={() => setModalSuccessLotePostado(false)}
                                textbutton="OK"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )
              })}
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControleDeTalao
