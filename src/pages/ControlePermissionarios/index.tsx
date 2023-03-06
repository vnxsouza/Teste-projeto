/* eslint-disable import/order */
/* eslint-disable import-helpers/order-imports */
import React, { useContext, useEffect, useState } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import './ControlePermissionarios.css'

import SideBar from '../../components/SideBarLateral'
import { AuthContext } from '../../contexts/AuthContext'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'

import { BsSearch, BsFillPersonPlusFill } from 'react-icons/bs'
import Tooltip from '@mui/material/Tooltip'
import { DatePicker, Space } from 'antd'
import type { DatePickerProps } from 'antd'
import { BiArrowBack } from 'react-icons/bi'
import { FaCar, FaRegIdCard, FaUserAlt } from 'react-icons/fa'
import Table from 'react-bootstrap/Table'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri'
import { CgLogOut } from 'react-icons/cg'
import { IoIosCloseCircle } from 'react-icons/io'
import Select from 'react-select'
import { useForm } from 'react-hook-form'

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { StepIconProps, StepLabel } from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import ModalTrocaProprietario from '../../components/ModalTrocaProprietario'
import ModalAdicionaCondutor from 'components/ModalAdicionaCondutor'
import NovoPermissionario from 'components/NovoPermissionario'
import { DadosContext } from 'contexts/DadosContext'
import CadastroVeiculos from 'components/CadastroVeiculo'
import dayjs from 'dayjs'
import api from 'services/api'
import FormTabelaEdicaoCondutor from 'components/FormTabelaEdicaoCondutor'
import FormTabelaEdicaoProprietarios from 'components/FormTabelaEdicaoProprietarios'
import ModalMessage from 'components/ModalMessage'
import ModalAdicionaProprietario from 'components/ModalAdicionaProprietario'

function ControlePermissionarios() {
  const { Permissoes } = useContext(AuthContext)
  const {
    classSideNav,
    tabelaVeiculos,
    telaConfiguracoes,
    cadastraVeiculos,
    cadastroPermissionario,
    voltaTabela,
    ativaConfiguracoesVeiculo,
    ativaCadastroVeiculo,
    ativaCadastroPermissionario
  } = useContext(CondicionaisFormContext)

  const {
    ehAtualizacao,
    setEhAtualizacao,
    cor,
    idVeiculoSelecionado,
    setIdVeiculoSelecionado,
    Permissionarios,
    atualizaPermissionarios,
    idProprietarioAtual,
    proprietariosSelecionados,
    setProprietariosSelecionados,
    condutoresSelecionados,
    setCondutoresSelecionados,
    condutoresInativos
  } = useContext(DadosContext)

  const [filterVeiculos, setFilterVeiculos] = useState([])

  const optionsCores = cor.map((dado) => ({ value: dado.id, label: dado.descricao }))

  useEffect(() => {
    setFilterVeiculos(Permissionarios)
  }, [Permissionarios])

  const [searchVeiculo, setSearchVeiculo] = useState('')

  const onChangeBuscaVeiculo = (e: { preventDefault: () => void; target: { value: string } }) => {
    e.preventDefault()
    setSearchVeiculo(e.target.value)

    const Filtro = Permissionarios.filter(
      (value) =>
        value.veiculo.placa?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        value.veiculo.prefixo?.toLowerCase().includes(e.target.value.toLowerCase())
    )

    setFilterVeiculos(Filtro)
  }

  const [linhasPerPage, setLinhasPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(0)

  const pages = Math.ceil(filterVeiculos.length / linhasPerPage - 1)
  const startIndex = currentPage * linhasPerPage
  const endIndex = startIndex + linhasPerPage
  const currentVeiculos = filterVeiculos.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(0)
  }, [linhasPerPage])

  const [iconOrdenaPlaca, setIconOrdenaPlaca] = useState(true)
  const [iconOrdenaTipoServico, setIconOrdenaTipoServico] = useState(true)
  const [iconOrdenaMarca, setIconOrdenaMarca] = useState(true)
  const [iconOrdenaNome, setIconOrdenaNome] = useState(true)

  const [placaVeiculoSelecionado, setPlacaVeiculoSelecionado] = useState('')
  const [anoLicenciamentoVeiculoSelecionado, setAnoLicenciamentoVeiculoSelecionado] = useState(0)
  const [idCorVeiculoSelecionado, setIdCorVeiculoSelecionado] = useState(0)

  const changeAnoLicenciamento: DatePickerProps['onChange'] = (date) => {
    if (date !== null) {
      setAnoLicenciamentoVeiculoSelecionado(date.year())
    } else {
      setAnoLicenciamentoVeiculoSelecionado(null)
    }
  }

  function trocaTela(dado, id) {
    setIdVeiculoSelecionado(id)
    setPlacaVeiculoSelecionado(dado.veiculo.placa)
    setAnoLicenciamentoVeiculoSelecionado(dado.veiculo.anoLicenciamento)
    setIdCorVeiculoSelecionado(dado.veiculo.corId)
    ativaConfiguracoesVeiculo()
  }

  const [modalSuccessAtualizacaoVeiculo, setModalSuccessAtualizacaoVeiculo] = useState(false)
  const [modalFalhaAtualizacaoVeiculo, setModalFalhaAtualizacaoVeiculo] = useState(false)
  const [messageSuccessAtualizacaoVeiculo, setMessageSuccessAtualizacaoVeiculo] = useState('')
  const [messageFalhaAtualizacaoVeiculo, setMessageFalhaAtualizacaoVeiculo] = useState([])

  const { register } = useForm({})

  function atualizaVeiculo() {
    const dadosAtualizadosVeiculo = {
      id: idVeiculoSelecionado,
      placa: placaVeiculoSelecionado.toUpperCase(),
      anoLicenciamento: anoLicenciamentoVeiculoSelecionado,
      corId: idCorVeiculoSelecionado
    }

    api
      .put('Veiculo/atualizar-veiculo', dadosAtualizadosVeiculo)
      .then((response) => {
        if (response.status === 200) {
          setModalSuccessAtualizacaoVeiculo(true)
          setMessageSuccessAtualizacaoVeiculo(response.data.message)
          atualizaPermissionarios()
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          if (error.response.data.message) {
            setMessageFalhaAtualizacaoVeiculo([error.response.data.message])
            setModalFalhaAtualizacaoVeiculo(true)
          } else {
            const mensagensErro = Object.values(error.response.data.errors)
            setMessageFalhaAtualizacaoVeiculo(mensagensErro.map((mensagens) => mensagens.toString()))
            setModalFalhaAtualizacaoVeiculo(true)
          }
        }
      })
  }

  const steps = ['Veículo', 'Proprietário', 'Condutor']

  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})

  const totalSteps = () => steps.length

  const completedSteps = () => Object.keys(completed).length

  const isLastStep = () => activeStep === totalSteps() - 1

  const allStepsCompleted = () => completedSteps() === totalSteps()

  const handleNext = (step) => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((i) => !(i in completed))
        : step === 0
        ? 0
        : step > 0 && step <= 2
        ? step
        : 0
    setActiveStep(newActiveStep)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStep = (step: React.SetStateAction<number>) => () => {
    setActiveStep(step)
  }

  const handleComplete = (step: React.SetStateAction<number>) => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext(step)
  }

  const [modalAdicionaProprietario, setModalAdicionaProprietario] = useState(false)
  const [modalAdicionaCondutor, setModalAdicionaCondutor] = useState(false)

  const [modalSuccessCadastroPermissionario, setModalSuccessCadastroPermissionario] = useState(false)
  const [modalFalhaCadastroPermissionario, setModalFalhaCadastroPermissionario] = useState(false)
  const [messageSuccessModalCadastroPermissionario, setMessageSuccessModalCadastroPermissionario] = useState('')
  const [messageFalhaModalCadastroPermissionario, setMessageFalhaModalCadastroPermissionario] = useState([])

  function enviaCadastroPermissionario() {
    const dadosPermissionario = {
      veiculoId: idVeiculoSelecionado,
      condutoresId: condutoresSelecionados,
      proprietarioAtualId: Number(proprietariosSelecionados)
    }

    api
      .post('Permissionario/cadastrar-permissionario', dadosPermissionario)
      .then((response) => {
        if (response.status === 200) {
          setModalSuccessCadastroPermissionario(true)
          setMessageSuccessModalCadastroPermissionario(response.data.message)
          atualizaPermissionarios()
        }
      })
      .catch((error) => {
        if (error.response.data.message) {
          setModalFalhaCadastroPermissionario(true)
          setMessageFalhaModalCadastroPermissionario([error.response.data.message])
        } else {
          const mensagensErro = Object.values(error.response.data.errors)
          setMessageFalhaModalCadastroPermissionario(mensagensErro.map((mensagens) => mensagens.toString()))
          setModalFalhaCadastroPermissionario(true)
        }
      })
  }

  const [modalSuccessAtualizaPermissionario, setModalSuccessAtualizaPermissionario] = useState(false)
  const [modalFalhaAtualizaPermissionario, setModalFalhaAtualizaPermissionario] = useState(false)
  const [messageSuccessModalAtualizaPermissionario, setMessageSuccessModalAtualizaPermissionario] = useState('')
  const [messageFalhaModalAtualizaPermissionario, setMessageFalhaModalAtualizaPermissionario] = useState([])

  function atualizaCadastroPermissionario() {
    const dadosPermissionario = {
      veiculoId: idVeiculoSelecionado,
      condutoresId: condutoresSelecionados,
      proprietariosId: proprietariosSelecionados,
      proprietarioAtualId: idProprietarioAtual,
      condutoresInativosId: condutoresInativos.length > 0 ? condutoresInativos : []
    }

    console.log(dadosPermissionario)

    api
      .put('Permissionario/atualizar-permissionario', dadosPermissionario)
      .then((response) => {
        if (response.status === 200) {
          setModalSuccessAtualizaPermissionario(true)
          setMessageSuccessModalAtualizaPermissionario(response.data.message)
          atualizaPermissionarios()
        }
      })
      .catch((error) => {
        if (error.response.data.message) {
          setModalFalhaAtualizaPermissionario(true)
          setMessageFalhaModalAtualizaPermissionario([error.response.data.message])
        } else {
          const mensagensErro = Object.values(error.response.data.errors)
          setMessageFalhaModalAtualizaPermissionario(mensagensErro.map((mensagens) => mensagens.toString()))
          setModalFalhaAtualizaPermissionario(true)
        }
      })
  }

  return (
    <div className="content">
      {Permissoes.toString() === 'Administrador' && (
        <div className="sideNavLateral">
          <SideBar />
        </div>
      )}

      <div className={`${classSideNav === 'sidenav' ? 'conteudoComSidenav' : 'conteudoSemSidenav'}`}>
        <div className="container mt-3">
          <h2 className="textTitle">Controle de Veículos</h2>
          {tabelaVeiculos && (
            <>
              <div className="menuNavegacao mb-2">
                <div className="iconsMenu">
                  <div className="pesquisaTabela">
                    <form>
                      <div className="labelFiltroAgente">
                        <div className="iconBusca">
                          <Tooltip title="Pesquisar" placement="bottom" arrow>
                            <div>
                              <BsSearch
                                size={25}
                                // onClick={ativaPesquisa}
                                color="white"
                              />
                            </div>
                          </Tooltip>
                        </div>

                        <input
                          type="text"
                          name="buscaVeiculo"
                          placeholder="Placa ou prefixo do veículo"
                          className="formFiltroAgente form-control"
                          id="buscaVeiculo"
                          value={searchVeiculo}
                          onChange={onChangeBuscaVeiculo}
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
                    {tabelaVeiculos ? (
                      <Tooltip title="Cadastrar novo veículo" placement="bottom" arrow>
                        <div>
                          <FaCar size={25} onClick={ativaCadastroVeiculo} className="iconNavegacao" />
                        </div>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Voltar a consulta" placement="bottom" arrow>
                        <div>
                          <BiArrowBack size={25} className="iconNavegacao" />
                        </div>
                      </Tooltip>
                    )}
                  </div>

                  <div className="itemMenuNavegacao">
                    {tabelaVeiculos && (
                      <Tooltip title="Adicionar permissionário" placement="bottom" arrow>
                        <div>
                          <BsFillPersonPlusFill
                            size={25}
                            onClick={ativaCadastroPermissionario}
                            className="iconNavegacao"
                          />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>

              <div className="tabelaAgentes container">
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th className="headerTabela">
                        <span>
                          Placa
                          {iconOrdenaPlaca ? (
                            <RiArrowDownSLine
                              size={20}
                              className="iconOrdenacao"
                              onClick={() => [
                                filterVeiculos.sort((a, b) => {
                                  if (a.veiculo.placa < b.veiculo.placa) return -1
                                  if (a.veiculo.placa > b.veiculo.placa) return 1
                                  return 0
                                }),
                                setIconOrdenaPlaca(false)
                              ]}
                            />
                          ) : (
                            <RiArrowUpSLine
                              size={20}
                              className="iconOrdenacao"
                              onClick={() => [
                                filterVeiculos.sort((a, b) => {
                                  if (a.veiculo.placa < b.veiculo.placa) return 1
                                  if (a.veiculo.placa > b.veiculo.placa) return -1
                                  return 0
                                }),
                                setIconOrdenaPlaca(true)
                              ]}
                            />
                          )}
                        </span>
                      </th>
                      <th className="headerTabela">
                        <span>Prefixo</span>
                      </th>
                      <th className="headerTabela">
                        <span>
                          Tipo de serviço
                          {iconOrdenaTipoServico ? (
                            <RiArrowDownSLine
                              size={20}
                              className="iconOrdenacao"
                              onClick={() => [
                                filterVeiculos.sort((a, b) => {
                                  if (a.tipoServico.descricao < b.tipoServico.descricao) return -1
                                  if (a.tipoServico.descricao > b.tipoServico.descricao) return 1
                                  return 0
                                }),
                                setIconOrdenaTipoServico(false)
                              ]}
                            />
                          ) : (
                            <RiArrowUpSLine
                              size={20}
                              className="iconOrdenacao"
                              onClick={() => [
                                filterVeiculos.sort((a, b) => {
                                  if (a.tipoServico.descricao < b.tipoServico.descricao) return 1
                                  if (a.tipoServico.descricao > b.tipoServico.descricao) return -1
                                  return 0
                                }),
                                setIconOrdenaTipoServico(true)
                              ]}
                            />
                          )}
                        </span>
                      </th>
                      <th className="headerTabela">
                        <span>
                          Marca/Modelo
                          {iconOrdenaMarca ? (
                            <RiArrowDownSLine
                              size={20}
                              className="iconOrdenacao"
                              onClick={() => [
                                filterVeiculos.sort((a, b) => {
                                  if (a.marcaModelo.descricao < b.marcaModelo.descricao) return -1
                                  if (a.marcaModelo.descricao > b.marcaModelo.descricao) return 1
                                  return 0
                                }),
                                setIconOrdenaMarca(false)
                              ]}
                            />
                          ) : (
                            <RiArrowUpSLine
                              size={20}
                              className="iconOrdenacao"
                              onClick={() => [
                                filterVeiculos.sort((a, b) => {
                                  if (a.marcaModelo.descricao < b.marcaModelo.descricao) return 1
                                  if (a.marcaModelo.descricao > b.marcaModelo.descricao) return -1
                                  return 0
                                }),
                                setIconOrdenaMarca(true)
                              ]}
                            />
                          )}
                        </span>
                      </th>
                      <th className="headerTabela">
                        <span>
                          Nome do proprietário
                          {iconOrdenaNome ? (
                            <RiArrowDownSLine
                              size={20}
                              className="iconOrdenacao"
                              //   onClick={() => [
                              //     filterVeiculos
                              //       .map((dado) => {
                              //         dado.proprietarios.map((teste) => {
                              //           console.log(teste)
                              //         })
                              //       })
                              //       .sort((a, b) => {
                              //         if (a.nomeProprietario < b.nomeProprietario) return -1
                              //         if (a.nomeProprietario > b.nomeProprietario) return 1
                              //         return 0
                              //       }),
                              //     setIconOrdenaNome(false)
                              //   ]}
                            />
                          ) : (
                            <RiArrowUpSLine
                              size={20}
                              className="iconOrdenacao"
                              //   onClick={() => [
                              //     filterVeiculos.sort((a, b) => {
                              //       if (a.nomeProprietario < b.nomeProprietario) return 1
                              //       if (a.nomeProprietario > b.nomeProprietario) return -1
                              //       return 0
                              //     }),
                              //     setIconOrdenaNome(true)
                              //   ]}
                            />
                          )}
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentVeiculos.map((dado) => (
                      <tr
                        key={dado.veiculoId}
                        className="linhaAgentesClicavel"
                        onClick={() => trocaTela(dado, dado.veiculoId)}
                      >
                        <td className="dadoTabela">{dado.veiculo.placa}</td>
                        <td className="dadoTabela">{dado.veiculo.prefixo || ''}</td>
                        <td className="dadoTabela">{dado.veiculo.tipoServico.descricao}</td>
                        <td className="dadoTabela">{dado.veiculo.marcaModelo.descricao}</td>
                        <td className="dadoTabela">
                          {dado.proprietarios.map(
                            (proprietario) =>
                              proprietario.id === dado.proprietarioAtualId && (
                                <span key={proprietario.id}>{proprietario.nome}</span>
                              )
                          )}
                        </td>
                      </tr>
                    ))}
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
                      // eslint-disable-next-line react/jsx-no-useless-fragment
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
            </>
          )}
          {telaConfiguracoes && (
            <Box
              sx={{
                width: '80%',
                margin: '0 auto'
              }}
            >
              <Stepper
                nonLinear
                activeStep={activeStep}
                className="timeLine mt-5"
                alternativeLabel
                // connector={<ColorlibConnector />}
              >
                {steps.map((label, index) => (
                  <Step key={label} completed={completed[index]}>
                    <StepLabel
                      icon={
                        index === 0 ? (
                          <FaCar size={30} color={activeStep === 0 ? '#508276' : 'black'} />
                        ) : index === 1 ? (
                          <FaUserAlt size={30} color={activeStep === 1 ? '#508276' : 'black'} />
                        ) : index === 2 ? (
                          <FaRegIdCard size={30} color={activeStep === 2 ? '#508276' : 'black'} />
                        ) : null
                      }
                      //   StepIconComponent={ColorlibStepIcon}
                      onClick={() => handleComplete(index)}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <hr className="divisor" />

              <div className="configuraVeiculo">
                <Box sx={{ mt: 2, mb: 1, py: 1, width: `${activeStep === 0 ? '100%' : '85%'}`, margin: '0 auto' }}>
                  {activeStep === 0 &&
                    filterVeiculos.map(
                      (dado) =>
                        dado.veiculoId === idVeiculoSelecionado && (
                          <div className="form-talao" key={dado.veiculoId}>
                            <div className="labelForm col-5 col-md-4">
                              <input
                                type="text"
                                name="placa"
                                id="placa"
                                className="form-control"
                                placeholder="Placa"
                                value={placaVeiculoSelecionado}
                                onChange={(e) => setPlacaVeiculoSelecionado(e.target.value)}
                              />
                              <label htmlFor="placa"> Placa </label>
                            </div>

                            <div className="labelForm col-5 col-md-4">
                              <input
                                type="text"
                                name="prefixo"
                                id="prefixo"
                                className="form-control"
                                placeholder="Prefixo"
                                value={dado.veiculo.prefixo || ''}
                                disabled
                                readOnly
                              />
                              <label htmlFor="prefixo"> Prefixo </label>
                            </div>

                            <div className="labelForm col-5 col-md-4">
                              <input
                                type="text"
                                name="renavam"
                                id="renavam"
                                className="form-control"
                                placeholder="Renavam"
                                // onChange={onChangePlaca} required
                                // onBlur={getVeiculos}
                                value={dado.veiculo.renavam}
                                readOnly
                                disabled
                              />
                              <label htmlFor="renavam"> Renavam </label>
                            </div>

                            <Space direction="vertical" className="selectYears col-4">
                              <DatePicker
                                onChange={changeAnoLicenciamento}
                                picker="year"
                                size="large"
                                className="datePicker col-12"
                                placeholder={
                                  anoLicenciamentoVeiculoSelecionado !== null
                                    ? anoLicenciamentoVeiculoSelecionado.toString()
                                    : ''
                                }
                              />
                              <label id="labelSelectAno" className="">
                                Ano de licenciamento
                              </label>
                            </Space>

                            <div className="labelForm col-5 col-md-4">
                              <input
                                type="text"
                                name="anoModelo"
                                id="anoModelo"
                                className="form-control"
                                placeholder="Ano de modelo"
                                // onChange={onChangePlaca} required
                                // onBlur={getVeiculos}
                                value={dado.veiculo.anoModelo || ''}
                                readOnly
                                disabled
                              />
                              <label htmlFor="anoModelo"> Ano de modelo </label>
                            </div>

                            <div className="labelForm col-5 col-md-4">
                              <input
                                type="text"
                                name="marcaModelo"
                                id="marcaModelo"
                                className="form-control"
                                placeholder="Marca/Modelo"
                                // onChange={onChangePlaca} required
                                // onBlur={getVeiculos}
                                value={dado.veiculo.marcaModelo.descricao || ''}
                                readOnly
                                disabled
                              />
                              <label htmlFor="anoModelo"> Marca/Modelo </label>
                            </div>

                            <div className="labelForm col-5 col-md-4">
                              <input
                                type="text"
                                name="tipoServico"
                                id="tipoServico"
                                className="form-control"
                                placeholder="Tipo de serviço"
                                // onChange={onChangePlaca} required
                                // onBlur={getVeiculos}
                                value={dado.veiculo.tipoServico.descricao || ''}
                                readOnly
                                disabled
                              />
                              <label htmlFor="tipoServico"> Tipo de serviço </label>
                            </div>

                            <div className="labelForm col-5 col-md-4">
                              <input
                                type="text"
                                name="chassi"
                                id="chassi"
                                className="form-control"
                                placeholder="Chassi"
                                // onChange={onChangePlaca} required
                                // onBlur={getVeiculos}
                                value={dado.veiculo.numeroChassi || ''}
                                readOnly
                                disabled
                              />
                              <label htmlFor="chassi"> Chassi </label>
                            </div>

                            <div className="labelForm col-4">
                              {/* <Select
                                className="selectTipoInfracao col-12"
                                options={optionsCores}
                                name="corNovoVeiculo"
                                id="corNovoVeiculo"
                                placeholder="Cor"
                                defaultInputValue={dado.veiculo.cor.descricao || ''}
                                onChange={(e) => setIdCorVeiculoSelecionado(e.value)}
                              /> */}
                              <select
                                name="corNovoVeiculo"
                                className="col-12"
                                value={dado.veiculo.cor !== null ? dado.veiculo.cor.id : 'Cor'}
                                {...register('corEdicaoVeiculo')}
                              >
                                <option disabled>Cor</option>
                                {cor.map((Cor) => (
                                  <option key={Cor.id} value={Cor.id}>
                                    {Cor.descricao}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )
                    )}

                  {activeStep === 1 && proprietariosSelecionados.length > 0 && <FormTabelaEdicaoProprietarios />}

                  {activeStep === 2 && condutoresSelecionados.length > 0 && <FormTabelaEdicaoCondutor />}

                  <ModalAdicionaProprietario
                    show={modalAdicionaProprietario}
                    textbutton="Adicionar"
                    textbutton2="Cancelar"
                    onHide={() => setModalAdicionaProprietario(false)}
                  />

                  <ModalAdicionaCondutor
                    show={modalAdicionaCondutor}
                    textbutton="Adicionar"
                    textbutton2="Cancelar"
                    onHide={() => setModalAdicionaCondutor(false)}
                  />

                  {modalSuccessAtualizacaoVeiculo && (
                    <ModalMessage
                      title={[messageSuccessAtualizacaoVeiculo]}
                      className="modalSuccess"
                      show={modalSuccessAtualizacaoVeiculo}
                      onHide={() => setModalSuccessAtualizacaoVeiculo(false)}
                      textbutton="Ok"
                      textbutton2="Ir para o ínicio"
                    />
                  )}

                  {modalFalhaAtualizacaoVeiculo && (
                    <ModalMessage
                      title={messageFalhaAtualizacaoVeiculo}
                      className="modalFalha"
                      show={modalFalhaAtualizacaoVeiculo}
                      onHide={() => setModalFalhaAtualizacaoVeiculo(false)}
                      textbutton="Ok"
                      textbutton2="Ir para o ínicio"
                    />
                  )}

                  {modalSuccessCadastroPermissionario && (
                    <ModalMessage
                      title={[messageSuccessModalCadastroPermissionario]}
                      className="modalSuccess"
                      show={modalSuccessCadastroPermissionario}
                      onHide={() => [setModalSuccessCadastroPermissionario(false), voltaTabela(), setActiveStep(0)]}
                      textbutton="Ok"
                      textbutton2="Ir para o ínicio"
                    />
                  )}

                  {modalFalhaCadastroPermissionario && (
                    <ModalMessage
                      title={messageFalhaModalCadastroPermissionario}
                      className="modalFalha"
                      show={modalFalhaCadastroPermissionario}
                      onHide={() => setModalFalhaCadastroPermissionario(false)}
                      textbutton="Ok"
                      textbutton2="Ir para o ínicio"
                    />
                  )}

                  {modalSuccessAtualizaPermissionario && (
                    <ModalMessage
                      title={[messageSuccessModalAtualizaPermissionario]}
                      className="modalSuccess"
                      show={modalSuccessAtualizaPermissionario}
                      onHide={() => [setModalSuccessAtualizaPermissionario(false), voltaTabela(), setActiveStep(0)]}
                      textbutton="Ok"
                      textbutton2="Ir para o ínicio"
                    />
                  )}

                  {modalFalhaAtualizaPermissionario && (
                    <ModalMessage
                      title={messageFalhaModalAtualizaPermissionario}
                      className="modalFalha"
                      show={modalFalhaAtualizaPermissionario}
                      onHide={() => setModalFalhaAtualizaPermissionario(false)}
                      textbutton="Ok"
                      textbutton2="Ir para o ínicio"
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    pt: 2,
                    width: '77%',
                    margin: '0 auto',
                    alignItems: 'center'
                  }}
                >
                  {
                    activeStep !== steps.length && (
                      <div className="iconVoltar configuracoes mb-5">
                        <Tooltip title="Voltar a consulta" placement="bottom" arrow>
                          <div>
                            <BiArrowBack
                              size={25}
                              onClick={() => [voltaTabela(), setActiveStep(0)]}
                              className="iconNavegacao"
                            />
                          </div>
                        </Tooltip>
                      </div>
                    )
                    // ))
                  }

                  <Box sx={{ flex: '1 1 auto' }} />
                  {activeStep === 0 && (
                    <Button onClick={atualizaVeiculo} sx={{ mr: 1 }} className="buttonChangeProprietario">
                      Atualizar veículo
                    </Button>
                  )}

                  {activeStep === 1 && proprietariosSelecionados.length === 0 ? (
                    <Button onClick={() => setModalAdicionaProprietario(true)} className="buttonChangeProprietario">
                      Adicionar proprietário
                    </Button>
                  ) : activeStep === 1 && ehAtualizacao ? (
                    <>
                      <Button onClick={() => setModalAdicionaProprietario(true)} className="buttonChangeProprietario">
                        Adicionar proprietário
                      </Button>
                      <Button onClick={() => handleComplete(activeStep + 1)} className="buttonChangeProprietario">
                        Próximo
                      </Button>
                    </>
                  ) : activeStep === 2 ? (
                    <Button onClick={() => setModalAdicionaCondutor(true)} className="buttonChangeProprietario">
                      Adicionar condutor
                    </Button>
                  ) : activeStep !== 2 ? (
                    <Button
                      onClick={() => handleComplete(activeStep + 1)}
                      className="buttonChangeProprietario"
                      disabled={idVeiculoSelecionado === 0}
                    >
                      Próximo
                    </Button>
                  ) : null}
                  {activeStep === 2 && (
                    <Button
                      onClick={ehAtualizacao ? atualizaCadastroPermissionario : enviaCadastroPermissionario}
                      className="buttonChangeProprietario"
                    >
                      {ehAtualizacao ? 'Atualizar' : 'Salvar'}
                    </Button>
                  )}

                  {/* {activeStep === 1 && (
                    <Button
                      onClick={() => setModalChangeProprietario(true)}
                      sx={{ mr: 1 }}
                      className="buttonChangeProprietario"
                    >
                      Alterar proprietário
                    </Button>
                  )}

                  {activeStep < 2 && (
                    <Button
                      onClick={() => handleComplete(activeStep + 1)}
                      sx={{ mr: 1 }}
                      className="buttonChangeProprietario"
                    >
                      Proximo
                    </Button>
                  )}

                  {activeStep === 2 && (
                    <>
                      <Button
                        onClick={() => setModalAdicionaCondutor(true)}
                        sx={{ mr: 1 }}
                        className="buttonChangeProprietario"
                      >
                        Adicionar condutor
                      </Button>

                      <Button
                        onClick={() => setModalAdicionaCondutor(true)}
                        sx={{ mr: 1 }}
                        className="buttonChangeProprietario"
                      >
                        Salvar
                      </Button>
                    </>
                  )} */}
                </Box>
              </div>
            </Box>
          )}
          {cadastraVeiculos && <CadastroVeiculos />}
          {cadastroPermissionario && <NovoPermissionario />}
        </div>
      </div>
    </div>
  )
}

export default ControlePermissionarios
