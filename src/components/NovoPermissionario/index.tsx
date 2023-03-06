import './NovoPermissionario.css'
import { yupResolver } from '@hookform/resolvers/yup'
import { StepIconProps, StepLabel } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import Tooltip from '@mui/material/Tooltip'
import FormTabelaEdicaoCondutor from 'components/FormTabelaEdicaoCondutor'
import FormTabelaEdicaoProprietarios from 'components/FormTabelaEdicaoProprietarios'
import ModalAdicionaCondutor from 'components/ModalAdicionaCondutor'
import ModalAdicionaProprietario from 'components/ModalAdicionaProprietario'
import ModalMessage from 'components/ModalMessage'
import { CondicionaisFormContext } from 'contexts/CondicionaisFormContext'
import { DadosContext } from 'contexts/DadosContext'
import React, { useContext, useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import { useForm } from 'react-hook-form'
import { BiArrowBack, BiCurrentLocation } from 'react-icons/bi'
import { FaCar, FaRegIdCard, FaUserAlt } from 'react-icons/fa'
import Select from 'react-select'
import api from 'services/api'
import * as yup from 'yup'

function NovoPermissionario() {
  const {
    ehAtualizacao,
    setEhAtualizacao,
    proprietariosSelecionados,
    idVeiculoSelecionado,
    setIdVeiculoSelecionado,
    idProprietarioAtual,
    setIdProprietarioAtual,
    condutoresSelecionados,
    condutoresInativos,
    setCondutoresInativos,
    setProprietariosSelecionados,
    setCondutoresSelecionados,
    atualizaPermissionarios
  } = useContext(DadosContext)

  const { voltaTabela } = useContext(CondicionaisFormContext)

  const steps = ['Veículo', 'Proprietário', 'Condutor']

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [activeStep, setActiveStep] = React.useState(0)
  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  const handleComplete = (step: React.SetStateAction<number>) => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext(step)
  }

  const [modalAdicionaProprietario, setModalAdicionaProprietario] = useState(false)
  const [modalAdicionaCondutor, setModalAdicionaCondutor] = useState(false)

  const { register } = useForm()

  const [placaNovoPermissionario, setPlacaNovoPermissionario] = useState('')
  const [renavamNovoPermissionario, setRenavamNovoPermissionario] = useState('')
  const [prefixoNovoPermissionario, setPrefixoNovoPermissionario] = useState('')
  const [anoLicenciamentoNovoPermissionario, setAnoLicenciamentoNovoPermissionario] = useState('')
  const [anoModeloNovoPermissionario, setAnoModeloNovoPermissionario] = useState('')
  const [marcaModeloNovoPermissionario, setMarcaModeloNovoPermissionario] = useState('')
  const [tipoServicoNovoPermissionario, setTipoServicoNovoPermissionario] = useState('')
  const [chassiNovoPermissionario, setChassiNovoPermissionario] = useState('')
  const [corNovoPermissionario, setCorNovoPermissionario] = useState('')

  const [modalSuccessCadastroPermissionario, setModalSuccessCadastroPermissionario] = useState(false)
  const [modalFalhaCadastroPermissionario, setModalFalhaCadastroPermissionario] = useState(false)
  const [messageSuccessModalCadastroPermissionario, setMessageSuccessModalCadastroPermissionario] = useState('')
  const [messageFalhaModalCadastroPermissionario, setMessageFalhaModalCadastroPermissionario] = useState([])

  useEffect(() => {
    if (!placaNovoPermissionario) {
      setIdVeiculoSelecionado(0)
      setRenavamNovoPermissionario('')
      setPrefixoNovoPermissionario('')
      setAnoLicenciamentoNovoPermissionario('')
      setAnoModeloNovoPermissionario('')
      setMarcaModeloNovoPermissionario('')
      setTipoServicoNovoPermissionario('')
      setChassiNovoPermissionario('')
      setCorNovoPermissionario('')
    }
  }, [placaNovoPermissionario])

  async function getPlacaNovoPermissionario() {
    if (placaNovoPermissionario.length > 0) {
      const response = await api.get('Veiculo/pesquisa-por-placa', {
        params: {
          placa: placaNovoPermissionario
        }
      })

      const veiculo = response.data.data

      console.log(veiculo)

      if (veiculo !== null) {
        setIdVeiculoSelecionado(veiculo.id)
        setRenavamNovoPermissionario(veiculo.renavam)
        setPrefixoNovoPermissionario(veiculo.prefixo)
        setAnoLicenciamentoNovoPermissionario(veiculo.anoLicenciamento)
        setAnoModeloNovoPermissionario(veiculo.anoModelo)
        setMarcaModeloNovoPermissionario(veiculo.marcaModelo.descricao)
        setTipoServicoNovoPermissionario(veiculo.tipoServico)
        setChassiNovoPermissionario(veiculo.numeroChassi)
        setCorNovoPermissionario(veiculo.cor.descricao)
      } else {
        setIdVeiculoSelecionado(0)
        setRenavamNovoPermissionario('')
        setPrefixoNovoPermissionario('')
        setAnoLicenciamentoNovoPermissionario('')
        setAnoModeloNovoPermissionario('')
        setMarcaModeloNovoPermissionario('')
        setTipoServicoNovoPermissionario('')
        setChassiNovoPermissionario('')
        setCorNovoPermissionario('')
      }
    }
  }

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
          setMessageFalhaModalCadastroPermissionario([error.data.message])
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
    <Box
      sx={{
        width: '80%',
        margin: '0 auto'
      }}
    >
      <Stepper
        nonLinear
        activeStep={activeStep}
        className={idVeiculoSelecionado !== 0 ? 'timeLine mt-5' : ''}
        alternativeLabel
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
              onClick={() => (idVeiculoSelecionado !== 0 ? handleComplete(index) : null)}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <hr className="divisor" />

      <form className="configuraVeiculo">
        <Box sx={{ mt: 2, mb: 1, py: 1, width: `${activeStep === 0 ? '100%' : '85%'}`, margin: '0 auto' }}>
          {activeStep === 0 && (
            <div className="form-talao">
              <div className="labelForm col-5 col-md-4">
                <input
                  type="text"
                  name="placaPermissionario"
                  id="placaPermissionario"
                  className="form-control"
                  placeholder="Placa"
                  value={placaNovoPermissionario}
                  onChange={(e) => setPlacaNovoPermissionario(e.target.value)}
                  onBlur={getPlacaNovoPermissionario}
                />
                <label htmlFor="placaPermissionario"> Placa </label>
              </div>

              <div className="labelForm col-5 col-md-4">
                <input
                  type="text"
                  name="renavamPermissionario"
                  id="renavamPermissionario"
                  className="form-control"
                  placeholder="Renavam"
                  {...register('renavamPermissionario')}
                  value={renavamNovoPermissionario}
                  readOnly
                  disabled
                />
                <label htmlFor="renavamPermissionario"> Renavam </label>
              </div>

              <div className="labelForm col-5 col-md-4">
                <input
                  type="text"
                  name="prefixoNovoPermissionario"
                  id="prefixoNovoPermissionario"
                  className="form-control"
                  placeholder="Prefixo"
                  {...register('prefixoNovoPermissionario')}
                  value={prefixoNovoPermissionario || ''}
                  readOnly
                  disabled
                />
                <label htmlFor="prefixoNovoPermissionario"> Prefixo </label>
              </div>

              <div className="labelForm col-5 col-md-4">
                <input
                  type="text"
                  name="anoLicenciamentoPermissionario"
                  id="anoLicenciamentoPermissionario"
                  className="form-control"
                  placeholder="Ano de licenciamento"
                  {...register('anoLicenciamentoPermissionario')}
                  value={anoLicenciamentoNovoPermissionario || ''}
                  readOnly
                  disabled
                />
                <label htmlFor="anoLicenciamentoPermissionario"> Ano de licenciamento </label>
              </div>

              <div className="labelForm col-5 col-md-4">
                <input
                  type="text"
                  name="anoModeloPermissionario"
                  id="anoModeloPermissionario"
                  className="form-control"
                  placeholder="Ano de modelo"
                  {...register('anoModeloPermissionario')}
                  value={anoModeloNovoPermissionario || ''}
                  readOnly
                  disabled
                />
                <label htmlFor="anoModeloPermissionario"> Ano de modelo </label>
              </div>

              <div className="labelForm col-5 col-md-4">
                <input
                  type="text"
                  name="marcaModeloPermissionario"
                  id="marcaModeloPermissionario"
                  className="form-control"
                  placeholder="Marca/Modelo"
                  {...register('marcaModeloPermissionario')}
                  value={marcaModeloNovoPermissionario || ''}
                  readOnly
                  disabled
                />
                <label htmlFor="marcaModeloPermissionario"> Marca/Modelo </label>
              </div>

              <div className="labelForm col-5 col-md-3">
                <input
                  type="text"
                  name="especiePermissionario"
                  id="especiePermissionario"
                  className="form-control"
                  placeholder="Espécie"
                  {...register('especiePermissionario')}
                  readOnly
                  disabled
                />
                <label htmlFor="especiePermissionario"> Espécie </label>
              </div>

              <div className="labelForm col-5 col-md-3">
                <input
                  type="text"
                  name="tipoServicoPermissionario"
                  id="tipoServicoPermissionario"
                  className="form-control"
                  placeholder="Tipo de serviço"
                  {...register('tipoServicoPermissionario')}
                  value={tipoServicoNovoPermissionario || ''}
                  disabled
                  readOnly
                />
                <label htmlFor="tipoServicoPermissionario"> Tipo de serviço </label>
              </div>

              <div className="labelForm col-5 col-md-3">
                <input
                  type="text"
                  name="chassiPermissionario"
                  id="chassiPermissionario"
                  className="form-control"
                  placeholder="Chassi"
                  maxLength={8}
                  {...register('chassiPermissionario')}
                  value={chassiNovoPermissionario || ''}
                  readOnly
                  disabled
                />
                <label htmlFor="chassiPermissionario"> Chassi </label>
              </div>

              <div className="labelForm col-5 col-md-3">
                <input
                  type="text"
                  name="corPermissionario"
                  id="corPermissionario"
                  className="form-control"
                  placeholder="Cor"
                  {...register('corPermissionario')}
                  value={corNovoPermissionario || ''}
                  readOnly
                  disabled
                />
                <label htmlFor="corPermissionario"> Cor </label>
              </div>
            </div>
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
            margin: '0 auto'
          }}
        >
          <div className="iconVoltar mb-5">
            <Tooltip title="Voltar a consulta" placement="bottom" arrow>
              <div>
                <BiArrowBack
                  size={25}
                  onClick={() => [
                    voltaTabela(),
                    setProprietariosSelecionados([]),
                    setCondutoresSelecionados([]),
                    setEhAtualizacao(false)
                  ]}
                  className="iconNavegacao"
                />
              </div>
            </Tooltip>
          </div>

          <Box sx={{ flex: '1 1 auto' }} />
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
        </Box>
      </form>
    </Box>
  )
}

export default NovoPermissionario
