/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */

import Tooltip from '@mui/material/Tooltip'
import { DatePicker, Space } from 'antd'
import locale from 'antd/es/date-picker/locale/pt_BR'
import axios from 'axios'
import dayjs from 'dayjs'
import React, { useContext, useEffect, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'
// eslint-disable-next-line import-helpers/order-imports
import Table from 'react-bootstrap/Table'
import './Relatorios.css'

import { FaFilePdf, FaFileWord, FaFileCsv, FaFileExcel, FaFileArchive } from 'react-icons/fa'
import { MdOutlineFilterList } from 'react-icons/md'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
// eslint-disable-next-line import-helpers/order-imports
import type { RangePickerProps } from 'antd/es/date-picker'
import 'dayjs/locale/pt-br'

import ModalMessage from '../../components/ModalMessage'
import SideBar from '../../components/SideBarLateral'
import { AuthContext } from '../../contexts/AuthContext'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'
import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'

function Relatorios() {
  const { classSideNav } = useContext(CondicionaisFormContext)

  const { Permissoes } = useContext(AuthContext)

  const {
    infracoesRegistradas,
    ModalidadeServico,
    valueTipoNotificacao,
    setValueTipoNotificacao,
    atualizaLotesGerados,
    atualizaInfracoes,
    diasDefesa,
    diasVencimento,
    diasJarit,
    tiposRelatorio,
    feriadosNacionais,
    feriadosMunicipais
  } = useContext(DadosContext)

  const { clienteCode } = useContext(AuthContext)

  const [filterInfracoes, setFilterInfracoes] = useState([])

  useEffect(() => {
    setFilterInfracoes(
      infracoesRegistradas.sort((a, b) => {
        if (a.dataInfracao < b.dataInfracao) return -1
        if (a.dataInfracao > b.dataInfracao) return 1
        return 0
      })
    )
  }, [infracoesRegistradas])

  const [iconOrdenaNumero, setIconOrdenaNumero] = useState(true)
  const [iconOrdenaData, setIconOrdenaData] = useState(true)
  const [iconOrdenaNumeroInfracao, setIconOrdenaNumeroInfracao] = useState(true)

  const [filterTipoServico, setFilterTipoServico] = useState('Tipo de serviço')

  useEffect(() => {
    if (filterTipoServico === 'Todos') {
      setFilterInfracoes(infracoesRegistradas)
    } else if (filterTipoServico === 'Estrutural') {
      const infracoesFiltradas = infracoesRegistradas.filter((value) => value.tipoServico.descricao === 'Estrutural')
      setFilterInfracoes(infracoesFiltradas)
    } else if (filterTipoServico === 'Escolar') {
      const infracoesFiltradas = infracoesRegistradas.filter((value) => value.tipoServico.descricao === 'Escolar')
      setFilterInfracoes(infracoesFiltradas)
    } else if (filterTipoServico === 'Táxi') {
      const infracoesFiltradas = infracoesRegistradas.filter((value) => value.tipoServico.descricao === 'Táxi')
      setFilterInfracoes(infracoesFiltradas)
    } else if (filterTipoServico === 'Moto-frete') {
      const infracoesFiltradas = infracoesRegistradas.filter((value) => value.tipoServico.descricao === 'Moto-frete')
      setFilterInfracoes(infracoesFiltradas)
    } else if (filterTipoServico === 'Clandestino') {
      const infracoesFiltradas = infracoesRegistradas.filter((value) => value.tipoServico.descricao === 'Clandestino')
      setFilterInfracoes(infracoesFiltradas)
    }
  }, [filterTipoServico, infracoesRegistradas])

  const [checkInfracoesSelecionadas, setCheckInfracoesSelecionadas] = useState([])

  const [selectAllInfracoes, setSelectAllInfracoes] = useState(false)

  const [valorTotalLote, setValorTotalLote] = useState(0)

  const handleSelectAllInfracoes = (e) => {
    setSelectAllInfracoes(!selectAllInfracoes)
    setCheckInfracoesSelecionadas(infracoesRegistradas.map((li) => li.id))
    setValorTotalLote(infracoesRegistradas.reduce((a, v) => (a += v.valorMulta), 0))
    if (selectAllInfracoes) {
      setCheckInfracoesSelecionadas([])
      setValorTotalLote(0)
    }
  }

  const handleCheckInfracoes = (e, valor) => {
    const { id, checked } = e.target
    setCheckInfracoesSelecionadas([...checkInfracoesSelecionadas, Number(id)])
    setValorTotalLote(valorTotalLote + valor)

    if (!checked) {
      setCheckInfracoesSelecionadas(checkInfracoesSelecionadas.filter((item) => item !== Number(id)))
      setValorTotalLote(valorTotalLote - valor)
    }
  }

  const [messageError, setMessageError] = useState(false)
  const [requiredTipoNotificacao, setRequiredTipoNotificacao] = useState(false)

  useEffect(() => {
    checkInfracoesSelecionadas.length > 0 && setMessageError(false)
  }, [checkInfracoesSelecionadas])

  useEffect(() => {
    valueTipoNotificacao !== 0 && setRequiredTipoNotificacao(false)
  }, [valueTipoNotificacao])

  const [successLoteGerado, setSuccessLoteGerado] = useState(false)
  const [modalSuccessLoteGerado, setModalSuccessLoteGerado] = useState(false)
  const [falhaLoteGerado, setFalhaLoteGerado] = useState(false)
  const [messageFalhaLoteGerado, setMessageFalhaLoteGerado] = useState([])

  const [feriadosDefinidos, setFeriadosDefinidos] = useState([])

  const feriadosTotais = feriadosNacionais.concat(feriadosMunicipais)

  useEffect(() => {
    // setFeriadosDefinidos(
    //   feriados.map((dado) => {
    //     return dado.date
    //   }))

    setFeriadosDefinidos(
      feriadosTotais.map((data) => {
        const stringData = new Date(data)
        stringData.setDate(stringData.getDate() + 1)

        return stringData.toDateString()
      })
    )
  }, [])

  const [dataLimite, setDataLimite] = useState('')
  // const [dataDesabilitada, setDataDesabilitada] = useState(false)

  useEffect(() => {
    dataLimite !== '' && setMessageDataLimite(false)
  }, [dataLimite])

  useEffect(() => {
    const current = new Date()

    if (valueTipoNotificacao === 1) {
      current.setDate(current.getDate() + diasDefesa)
    } else if (valueTipoNotificacao === 2) {
      current.setDate(current.getDate() + diasVencimento)
    } else if (valueTipoNotificacao === 3) {
      current.setDate(current.getDate() + diasJarit)
    }

    while (
      current.toDateString().match(/Sat/) ||
      current.toDateString().match(/Sun/) ||
      feriadosDefinidos.includes(current.toDateString())
    ) {
      current.setDate(current.getDate() + 1)
    }

    const dateLimit = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current
      .getDate()
      .toString()
      .padStart(2, '0')}`

    setDataLimite(dateLimit)
  }, [valueTipoNotificacao, diasDefesa, diasVencimento, diasJarit, feriadosDefinidos])

  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps['disabledDate'] = (datas) => {
    const date = new Date()

    if (valueTipoNotificacao === 1) {
      date.setDate(date.getDate() + (diasDefesa - 1))
    } else if (valueTipoNotificacao === 2) {
      date.setDate(date.getDate() + (diasVencimento - 1))
    } else if (valueTipoNotificacao === 3) {
      date.setDate(date.getDate() + (diasJarit - 1))
    }

    const verificaFeriado = `${datas.year()}-${(datas.month() + 1).toString().padStart(2, '0')}-${datas
      .date()
      .toString()
      .padStart(2, '0')}`

    const feriadosDesabilitados = feriadosTotais.find((feriado) => feriado === verificaFeriado)

    return datas.toDate() < date || datas.day() === 0 || datas.day() === 6 || feriadosDesabilitados !== undefined
  }

  const [loadingLote, setLoadingLote] = useState(false)

  function loteGerado() {
    setLoadingLote(false)
    setValueTipoNotificacao(1)
    setFilterTipoServico('Tipo de serviço')
    setSelectAllInfracoes(false)
    setSuccessLoteGerado(true)
    setModalSuccessLoteGerado(true)
    setCheckInfracoesSelecionadas([])
    setValorTotalLote(0)
    atualizaLotesGerados()
    atualizaInfracoes()
  }

  const [valueTipoRelatorio, setValueTipoRelatorio] = useState(2)

  function geraLote() {
    setLoadingLote(true)

    const dadosLote = {
      clienteId: Number(clienteCode),
      tipoNotificacaoId: valueTipoNotificacao,
      dataLimite,
      infracoesId: checkInfracoesSelecionadas,
      tipoRelatorio: valueTipoRelatorio
    }

    api
      .post('Notificacao/lote-infracao', dadosLote, {
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

        loteGerado()
      })
      .catch((error) => {
        setLoadingLote(false)
        // if (error.response.status === 400 || error.response.status === 500) {
        //   if (error.response.data.message) {
        //     setMessageFalhaLoteGerado([error.response.data.message])
        //     setFalhaLoteGerado(true)
        //     setLoadingLote(false)
        //   } else {
        //     const mensagensErro = Object.values(error.response.data.errors)
        //     setMessageFalhaLoteGerado(mensagensErro.map((mensagens) => mensagens.toString()))
        //     setFalhaLoteGerado(true)
        //     setLoadingLote(false)
        //   }
        // }
      })
  }

  const onChangeDataLimite = (datas) => {
    if (datas !== null) {
      setDataLimite(`${datas.$y}-${(datas.$M + 1).toString().padStart(2, '0')}-${datas.$D.toString().padStart(2, '0')}`)
    } else {
      setDataLimite('')
    }
  }

  const [messageDataLimite, setMessageDataLimite] = useState(false)

  return (
    <>
      {loadingLote && (
        <div className="loadingLote">
          <div className="elementsLoading">
            <div className="iconeLoading">
              <Spinner animation="border" />
            </div>
            <span>Processando... Por favor, aguarde</span>
          </div>
        </div>
      )}

      <div className="content">
        {Permissoes.toString() === 'Administrador' && (
          <div className="sideNavLateral">
            <SideBar />
          </div>
        )}

        <div className={`${classSideNav === 'sidenav' ? 'conteudoComSidenav' : 'conteudoSemSidenav'}`}>
          <div className="controleNotificacoes container mt-3">
            <div>
              <h2>Gerar lote de notificações</h2>
            </div>
            <form className="form mb-4">
              <div className="form-talao">
                <div className="headerPanelsInfracoes container mt-3">
                  <div className="panelFilterInfracoes col-12">
                    <div className="tituloPanel mb-2">
                      <h6>Filtros</h6>
                      <MdOutlineFilterList size={20} color="white" />
                    </div>

                    <div className="filtrosInfracoes">
                      <div className="selectFilterInfracoes col-12 col-md-3">
                        <select
                          className="col-12"
                          value={valueTipoNotificacao}
                          onChange={(e) => setValueTipoNotificacao(Number(e.target.value))}
                        >
                          <option value={0} disabled>
                            Tipo de Notificação
                          </option>
                          {/* <option value={1}>Todas</option> */}
                          <option value={1}>Autuação</option>
                          {/* <option value={2}>Penalidade</option>
                          <option value={3}>Resultado de recurso</option> */}
                        </select>

                        {requiredTipoNotificacao && (
                          <div>
                            <span className="messageError mb-3">O tipo de notificacão é obrigatório!</span>
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-md-3 mb-1">
                        <select
                          className="col-12 mt-1"
                          value={filterTipoServico}
                          onChange={(e) => setFilterTipoServico(e.target.value)}
                        >
                          <option disabled>Tipo de serviço</option>
                          <option>Todos</option>
                          {ModalidadeServico.map((dado) => (
                            <option key={dado.id} value={dado.descricao}>
                              {dado.descricao}
                            </option>
                          ))}
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

            {filterInfracoes.length === 0 ? (
              <div className="nenhumaInfracao">
                <h4 className="mt-3">Nenhuma infração encontrada</h4>
              </div>
            ) : (
              <>
                <div className="tabelaAgentes mb-1">
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th className="selectInfracoes">
                          <input
                            type="checkbox"
                            className="checkboxInfracoes"
                            checked={selectAllInfracoes}
                            onChange={(e) => handleSelectAllInfracoes(e)}
                          />
                        </th>

                        <th className="headerTabela">
                          <span>N° da infração</span>
                          {iconOrdenaNumeroInfracao ? (
                            <RiArrowDownSLine
                              size={20}
                              className="iconOrdenacao"
                              onClick={() => [
                                filterInfracoes.sort((a, b) => {
                                  if (a.numeroAuto < b.numeroAuto) return -1
                                  if (a.numeroAuto > b.numeroAuto) return 1
                                  return 0
                                }),
                                setIconOrdenaNumeroInfracao(false)
                              ]}
                            />
                          ) : (
                            <RiArrowUpSLine
                              size={20}
                              className="iconOrdenacao"
                              onClick={() => [
                                filterInfracoes.sort((a, b) => {
                                  if (a.numeroAuto < b.numeroAuto) return 1
                                  if (a.numeroAuto > b.numeroAuto) return -1
                                  return 0
                                }),
                                setIconOrdenaNumeroInfracao(true)
                              ]}
                            />
                          )}
                        </th>

                        <th className="headerTabela">
                          <span>Tipo de serviço</span>
                        </th>

                        <th className="headerTabelaData">
                          <span>Data da infração</span>
                          {iconOrdenaData ? (
                            <RiArrowDownSLine
                              size={20}
                              className="iconOrdenacao"
                              onClick={() => [
                                filterInfracoes.sort((a, b) => {
                                  if (a.dataInfracao < b.dataInfracao) return -1
                                  if (a.dataInfracao > b.dataInfracao) return 1
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
                                  if (a.dataInfracao < b.dataInfracao) return 1
                                  if (a.dataInfracao > b.dataInfracao) return -1
                                  return 0
                                }),
                                setIconOrdenaData(true)
                              ]}
                            />
                          )}
                        </th>

                        <th className="headerTabela">
                          <div className="lastHeaderTabela">
                            <span>
                              Valor
                              {iconOrdenaNumero ? (
                                <RiArrowDownSLine
                                  size={20}
                                  className="iconOrdenacao"
                                  onClick={() => [
                                    filterInfracoes.sort((a, b) => {
                                      if (a.valorMulta < b.valorMulta) return -1
                                      if (a.valorMulta > b.valorMulta) return 1
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
                                      if (a.valorMulta < b.valorMulta) return 1
                                      if (a.valorMulta > b.valorMulta) return -1
                                      return 0
                                    }),
                                    setIconOrdenaNumero(true)
                                  ]}
                                />
                              )}
                            </span>
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filterInfracoes.map((dado) => {
                        const anoData = dado.dataInfracao.slice(0, 4)
                        const mesData = dado.dataInfracao.slice(5, 7)
                        const diaData = dado.dataInfracao.slice(8, 10)

                        const data = `${diaData}/${mesData}/${anoData}`

                        const valorMulta =
                          dado.valorMulta !== 0
                            ? parseFloat(dado.valorMulta).toFixed(2).replace('.', ',')
                            : parseFloat(dado.valorMulta)

                        return (
                          <tr className="linhaAgentes" key={dado.id}>
                            <td className="checkInfracoes">
                              <input
                                type="checkbox"
                                value={dado.id}
                                id={dado.id}
                                checked={checkInfracoesSelecionadas.includes(dado.id)}
                                className="checkboxInfracoes"
                                onChange={(e) => handleCheckInfracoes(e, dado.valorMulta)}
                              />
                            </td>

                            <td className="dadoTabela">
                              <span>{dado.numeroAuto}</span>
                            </td>

                            <td className="dadoTabela">
                              <span>{dado.tipoServico.descricao}</span>
                            </td>

                            <td className="dadoTabelaData">
                              <span>{data}</span>
                            </td>

                            <td>
                              <div className="colunaExpandeInfracao">
                                <div className="nomeCondutor">{`R$ ${valorMulta}`}</div>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    {checkInfracoesSelecionadas.length > 0 && (
                      <tfoot>
                        <tr>
                          <td colSpan={3}>
                            <span>Infrações selecionadas: {checkInfracoesSelecionadas.length}</span>
                          </td>
                          <td>
                            <span>Valor total:</span>
                          </td>
                          <td>
                            <span className="valorTotalLote">
                              {`R$: ${valorTotalLote.toFixed(2).replace('.', ',')}`}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </Table>
                </div>

                <div className="envioLote container mb-4 mt-3 col-12">
                  <div className="dataLimiteLote col-5 col-md-3">
                    <div>
                      <span className="textLabel">Data limite:</span>
                    </div>
                    <div>
                      <Space direction="vertical" className="col-12">
                        <div className="mt-4">
                          <DatePicker
                            locale={locale}
                            size="large"
                            className="col-12"
                            value={dataLimite !== '' && dayjs(dataLimite, 'YYYY-MM-DD')}
                            disabledDate={disabledDate}
                            placeholder="Data Limite"
                            onChange={onChangeDataLimite}
                            format="DD/MM/YYYY"
                          />

                          {messageDataLimite && (
                            <div>
                              <p className="messageError mt-1">A data limite é obrigatória!</p>
                            </div>
                          )}
                        </div>
                      </Space>
                    </div>
                  </div>

                  <div className="tipoArquivo col-5 col-md-3">
                    <div>
                      <span className="textLabel">Tipo de arquivo:</span>
                    </div>
                    <select
                      className="col-12 mt-4"
                      value={valueTipoRelatorio}
                      onChange={(e) => setValueTipoRelatorio(Number(e.target.value))}
                    >
                      <option disabled>Tipo de arquivo</option>
                      {tiposRelatorio.map((dado) => (
                        <option key={dado.id} value={dado.id}>
                          {dado.descricao.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="botaoGerarLote col-12 col-md-4">
                    <Tooltip title="Clique para baixar o lote" arrow placement="bottom">
                      <div
                        className="labelGerarLote col-7 col-md-10 mt-4"
                        onClick={
                          checkInfracoesSelecionadas.length === 0
                            ? () => setMessageError(true)
                            : valueTipoNotificacao === 0
                            ? () => setRequiredTipoNotificacao(true)
                            : dataLimite === ''
                            ? () => setMessageDataLimite(true)
                            : () => geraLote()
                        }
                      >
                        <span className="textGerarLote">Gerar e baixar lote</span>
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
                    </Tooltip>

                    {messageError && (
                      <div>
                        <p className="messageError mt-1">Selecine pelo menos uma infração</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {successLoteGerado && (
              <ModalMessage
                title={['Lote gerado com sucesso!']}
                className="modalSuccess"
                show={modalSuccessLoteGerado}
                onHide={() => setModalSuccessLoteGerado(false)}
                textbutton="OK"
                textbutton2="Ir para o ínicio"
              />
            )}

            <ModalMessage
              title={messageFalhaLoteGerado}
              className="modalFalha"
              show={falhaLoteGerado}
              onHide={() => setFalhaLoteGerado(false)}
              textbutton="OK"
              textbutton2="Ir para o ínicio"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Relatorios
