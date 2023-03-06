import { yupResolver } from '@hookform/resolvers/yup'
import Tooltip from '@mui/material/Tooltip'
import { DatePicker, Space } from 'antd'
import type { DatePickerProps } from 'antd'
import ButtonSubmit from 'components/ButtonSubmit'
import ModalMessage from 'components/ModalMessage'
import { CondicionaisFormContext } from 'contexts/CondicionaisFormContext'
import { DadosContext } from 'contexts/DadosContext'
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiArrowBack } from 'react-icons/bi'
import Select from 'react-select'
import api from 'services/api'
import * as yup from 'yup'
import dayjs from 'dayjs'
import { ErrorForm } from 'components/FormTalao/ErrorForm'

function CadastroVeiculos() {
  const {
    cor,
    marcaModelo,
    ModalidadeServico,
    onChangeMarcaModelo,
    filterMarcaModelo,
    textMarcaModelo,
    setTextMarcaModelo,
    idMarcaModelo,
    selecionaMarcaModelo,
    atualizaPermissionarios
  } = useContext(DadosContext)
  const { voltaTabela } = useContext(CondicionaisFormContext)

  const optionsCores = cor.map((dado) => ({ value: dado.id, label: dado.descricao }))
  const optionsTipoServico = ModalidadeServico.map((dado) => ({ value: dado.id, label: dado.descricao }))

  // const [idCorNovoVeiculo, setIdCorNovoVeiculo] = useState(0)
  // const [textOptionCor, setTextOptionCor] = useState([])
  // const [idEspecieNovoVeiculo, setIdEspecieNovoVeiculo] = useState(0)
  // const [textOptionTipoServico, setTextOptionTipoServico] = useState([])

  const validaCriacaoVeiculo = yup.object({
    placaNovoVeiculo: yup.string().required(),
    prefixoNovoVeiculo: yup.string().required(),
    renavamNovoVeiculo: yup.string().required(),
    marcaModeloNovoVeiculo: yup.string().required(),
    numeroChassiNovoVeiculo: yup.string().required(),
    tipoServicoNovoVeiculo: yup.number().required(),
    corNovoVeiculo: yup.number().required()
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validaCriacaoVeiculo)
  })

  const [successCadastroVeiculo, setSuccessCadastroVeiculo] = useState(false)
  const [falhaCadastroVeiculo, setFalhaCadastroVeiculo] = useState(false)
  const [messageSuccessCadastroVeiculo, setMessageSuccessCadastroVeiculo] = useState('')
  const [messageFalhaCadastroVeiculo, setMessageFalhaCadastroVeiculo] = useState([])

  const [anoLicenciamentoNovoVeiculo, setAnoLicenciamentoNovoVeiculo] = useState('')
  const [anoModeloNovoVeiculo, setAnoModeloNovoVeiculo] = useState('')
  const [requiredAnoLicenciamentoNovoVeiculo, setRequiredAnoLicenciamentoNovoVeiculo] = useState(false)
  const [requiredAnoModeloNovoVeiculo, setRequiredAnoModeloNovoVeiculo] = useState(false)

  function submitCadastroVeiculo() {
    setSuccessCadastroVeiculo(true)
    setAnoLicenciamentoNovoVeiculo('')
    setAnoModeloNovoVeiculo('')
    setTextMarcaModelo('')
    atualizaPermissionarios()
  }

  const formCadastraVeiculo = (data) => {
    const dadosNovoVeiculo = {
      placa: data.placaNovoVeiculo.toUpperCase().trim(),
      prefixo: data.prefixoNovoVeiculo.trim(),
      numeroChassi: data.numeroChassiNovoVeiculo.trim(),
      marcaModeloId: idMarcaModelo,
      corId: Number(data.corNovoVeiculo),
      anoLicenciamento: Number(anoLicenciamentoNovoVeiculo) !== 0 ? Number(anoLicenciamentoNovoVeiculo) : null,
      anoModelo: Number(anoModeloNovoVeiculo) !== 0 ? Number(anoModeloNovoVeiculo) : null,
      renavam: data.renavamNovoVeiculo.trim(),
      especie: Number(data.tipoServicoNovoVeiculo),
      clandestino: Number(data.tipoServicoNovoVeiculo) === 50,
      tipoServicoId: Number(data.tipoServicoNovoVeiculo),
      municipioId: null
    }

    if (!requiredAnoLicenciamentoNovoVeiculo && !requiredAnoModeloNovoVeiculo) {
      api
        .post('Veiculo/cadastrar-veiculo', dadosNovoVeiculo)

        .then((response) => {
          if (response.status === 200) {
            setMessageSuccessCadastroVeiculo(response.data.message)
            submitCadastroVeiculo()
          }
        })
        .catch((error) => {
          if (error.response.status === 400 || error.response.status === 500) {
            if (error.response.data.message) {
              setMessageFalhaCadastroVeiculo(error.response.data.message)
              setFalhaCadastroVeiculo(true)
            } else {
              const mensagensErro = Object.values(error.response.data.errors)
              setMessageFalhaCadastroVeiculo(mensagensErro.map((mensagens) => mensagens.toString()))
              setFalhaCadastroVeiculo(true)
            }
          }
        })
    }
  }

  const changeAnoLicenciamento: DatePickerProps['onChange'] = (date) => {
    if (date !== null) {
      setAnoLicenciamentoNovoVeiculo(date.year().toString())
    } else {
      setAnoLicenciamentoNovoVeiculo('')
    }
  }

  const changeAnoModelo: DatePickerProps['onChange'] = (date) => {
    if (date !== null) {
      setAnoModeloNovoVeiculo(date.year().toString())
    } else {
      setAnoModeloNovoVeiculo('')
    }
  }

  function validaInputsWYears() {
    if (anoLicenciamentoNovoVeiculo === '' && anoModeloNovoVeiculo === '') {
      setRequiredAnoLicenciamentoNovoVeiculo(true)
      setRequiredAnoModeloNovoVeiculo(true)
    }

    if (anoLicenciamentoNovoVeiculo === '') {
      setRequiredAnoLicenciamentoNovoVeiculo(true)
    } else if (anoModeloNovoVeiculo === '') {
      setRequiredAnoModeloNovoVeiculo(true)
    } else {
      return null
    }
  }

  useEffect(() => {
    if (anoLicenciamentoNovoVeiculo !== '') {
      setRequiredAnoLicenciamentoNovoVeiculo(false)
    }

    if (anoModeloNovoVeiculo !== '') {
      setRequiredAnoModeloNovoVeiculo(false)
    }
  }, [anoLicenciamentoNovoVeiculo, anoModeloNovoVeiculo])

  return (
    <div className="cadastro novoUsuario">
      <form className="criaUsuario mb-4" onSubmit={handleSubmit(formCadastraVeiculo)} autoComplete="off">
        <div className="subtitulo mb-2">
          <h6 className="mt-1" onClick={() => setTextMarcaModelo('')}>
            Cadastrar novo veículo
          </h6>
        </div>

        <div className="formCriaUsuario">
          <div className="labelForm col-3">
            <input
              type="text"
              className="form-control"
              name="placaNovoVeiculo"
              id="placaNovoVeiculo"
              placeholder="Placa"
              maxLength={7}
              {...register('placaNovoVeiculo')}
            />
            <label htmlFor="placaNovoVeiculo">Placa</label>
            {errors?.placaNovoVeiculo?.type && <ErrorForm />}
          </div>

          <div className="labelForm col-3">
            <input
              type="text"
              className="form-control"
              name="prefixoNovoVeiculo"
              id="prefixoNovoVeiculo"
              placeholder="Prefixo"
              {...register('prefixoNovoVeiculo')}
            />
            <label htmlFor="prefixoNovoVeiculo">Prefixo</label>
            {errors?.prefixoNovoVeiculo?.type && <ErrorForm />}
          </div>

          <div className="labelForm col-4">
            <input
              type="text"
              className="form-control"
              name="renavamNovoVeiculo"
              id="renavamNovoVeiculo"
              maxLength={11}
              placeholder="Renavam"
              {...register('renavamNovoVeiculo')}
            />
            <label htmlFor="renavamNovoVeiculo">Renavam</label>
            {errors?.renavamNovoVeiculo?.type && <ErrorForm />}
          </div>

          {/* <div className="labelForm col-3"> */}
          {/* <input
              type="text"
              className="form-control"
              name="anoLicenciamentoNovoVeiculo"
              id="anoLicenciamentoNovoVeiculo"
              placeholder="Ano de licenciamento"
              {...register('anoLicenciamentoNovoVeiculo')}
            />
            <label htmlFor="anoLicenciamentoNovoVeiculo">Ano de licenciamento</label> */}
          <Space direction="vertical" className="selectYears col-3">
            <DatePicker
              value={anoLicenciamentoNovoVeiculo !== '' && dayjs(anoLicenciamentoNovoVeiculo)}
              onChange={changeAnoLicenciamento}
              format="YYYY"
              picker="year"
              size="large"
              className="datePicker col-12"
              placeholder="Ano de Licenciamento"
            />
            {requiredAnoLicenciamentoNovoVeiculo && <ErrorForm />}
          </Space>
          {/* </div> */}

          {/* <div className="labelForm col-3"> */}
          {/* <input
              type="text"
              className="form-control"
              name="anoModeloNovoVeiculo"
              id="anoModeloNovoVeiculo"
              placeholder="Ano de modelo"
              {...register('anoModeloNovoVeiculo')}
            />
            <label htmlFor="anoModeloNovoVeiculo">Ano de modelo</label> */}

          <Space direction="vertical" className="selectYears col-3" id="selectYears">
            <DatePicker
              value={anoModeloNovoVeiculo !== '' && dayjs(anoModeloNovoVeiculo)}
              onChange={changeAnoModelo}
              format="YYYY"
              name="anoModeloNovoVeiculo"
              id="anoModeloNovoVeiculo"
              picker="year"
              size="large"
              className="datePicker col-12"
              placeholder="Ano de Modelo"
            />
            {requiredAnoModeloNovoVeiculo && <ErrorForm />}
          </Space>
          {/* </div> */}

          {/* <div className="labelForm col-4">
            <Select
              className="selectTipoInfracao col-12"
              options={optionsMarcaModelo}
              name="marcaModeloNovoVeiculo"
              id="marcaModeloNovoVeiculo"
              placeholder="Marca/Modelo"
              onChange={(e) => setIdMarcaModeloNovoVeiculo(e.value)}
            />
          </div> */}

          <div className="labelForm col-11 col-md-4">
            <input
              type="text"
              name="marcaModeloNovoVeiculo"
              id="marcaModeloNovoVeiculo"
              className="form-control"
              placeholder="Marca/ Modelo"
              {...register('marcaModeloNovoVeiculo')}
              value={textMarcaModelo}
              onChange={onChangeMarcaModelo}
            />
            <label htmlFor="marcaModeloNovoVeiculo"> Marca/ Modelo </label>

            {filterMarcaModelo.length > 0 && (
              <div className="optionsMunicipios col-12">
                {filterMarcaModelo.map((dado) => (
                  <div className="listaMunicipios" key={dado.id} onClick={() => selecionaMarcaModelo(dado)}>
                    {dado.descricao}
                  </div>
                ))}
              </div>
            )}
            {errors?.marcaModeloNovoVeiculo?.type && textMarcaModelo.length === 0 && <ErrorForm />}
          </div>

          <div className="labelForm col-4">
            {/* <Select
              className="selectTipoInfracao col-12"
              options={optionsTipoServico}
              name="tipoServicoNovoVeiculo"
              id="tipoServicoNovoVeiculo"
              placeholder="Tipo de serviço"
              value={textOptionTipoServico}
              onChange={(e) =>
                e === null
                  ? [setTextOptionTipoServico([]), setIdEspecieNovoVeiculo(0)]
                  : [setIdEspecieNovoVeiculo(e.value), setTextOptionTipoServico(e)]
              }
              isClearable
              //   onChange={(e) => console.log(e)}
            /> */}
            <select
              name="tipoServicoNovoVeiculo"
              className="col-12"
              defaultValue="Tipo de serviço"
              {...register('tipoServicoNovoVeiculo')}
            >
              <option disabled>Tipo de serviço</option>
              {ModalidadeServico.map((servico) => (
                <option key={servico.id} value={servico.id}>
                  {servico.descricao}
                </option>
              ))}
            </select>
            {errors?.tipoServicoNovoVeiculo?.type && <ErrorForm />}
          </div>

          <div className="labelForm col-3">
            <input
              type="text"
              className="form-control"
              name="numeroChassiNovoVeiculo"
              maxLength={17}
              id="numeroChassiNovoVeiculo"
              placeholder="Chassi"
              {...register('numeroChassiNovoVeiculo')}
            />
            <label htmlFor="numeroChassiNovoVeiculo">Chassi</label>
            {errors?.numeroChassiNovoVeiculo?.type && <ErrorForm />}
          </div>

          <div className="labelForm col-3">
            {/* <Select
              className="selectTipoInfracao col-12"
              options={optionsCores}
              name="corNovoVeiculo"
              id="corNovoVeiculo"
              placeholder="Cor"
              value={textOptionCor}
              onChange={(e) =>
                e === null
                  ? [setTextOptionCor([]), setIdCorNovoVeiculo(0)]
                  : [setIdCorNovoVeiculo(e.value), setTextOptionCor(e)]
              }
              isClearable
            /> */}
            <select name="corNovoVeiculo" className="col-12" defaultValue="Cor" {...register('corNovoVeiculo')}>
              <option disabled>Cor</option>
              {cor.map((dado) => (
                <option key={dado.id} value={dado.id}>
                  {dado.descricao}
                </option>
              ))}
            </select>
            {errors?.corNovoVeiculo?.type && <ErrorForm />}
          </div>

          {/* 
          <div className="labelForm col-4">
            <input
              type="text"
              className="form-control"
              name="nomeCorporacao"
              id="nomeCorporacao"
              placeholder="Nome"
              {...register('nomeCorporacao')}
            />
            <label htmlFor="nomeAgente">Bairro</label>
          </div>

          <div className="labelForm col-3">
            <input
              type="text"
              className="form-control"
              name="nomeCorporacao"
              id="nomeCorporacao"
              placeholder="Nome"
              {...register('nomeCorporacao')}
            />
            <label htmlFor="nomeAgente">Município</label>
          </div>

          <div className="labelForm col-3">
            <input
              type="text"
              className="form-control"
              name="nomeCorporacao"
              id="nomeCorporacao"
              placeholder="Nome"
              {...register('nomeCorporacao')}
            />
            <label htmlFor="nomeAgente">E-Mail</label>
          </div>

          <div className="labelForm col-4">
            <input
              type="text"
              className="form-control"
              name="nomeCorporacao"
              id="nomeCorporacao"
              placeholder="Nome"
              {...register('nomeCorporacao')}
            />
            <label htmlFor="nomeAgente">Celular</label>
          </div> */}

          <div className="buttonCriaUsuario col-12">
            <div className="iconVoltar">
              <Tooltip title="Voltar a consulta" placement="bottom" arrow>
                <div>
                  <BiArrowBack size={25} onClick={voltaTabela} className="iconNavegacao" />
                </div>
              </Tooltip>
            </div>
            <ButtonSubmit type="submit" text="Cadastrar" onClick={validaInputsWYears} />
          </div>

          <ModalMessage
            title={[messageSuccessCadastroVeiculo]}
            className="modalSuccess"
            show={successCadastroVeiculo}
            onHide={() => [setSuccessCadastroVeiculo(false), reset()]}
            textbutton="Voltar ao registro de Veículo"
            textbutton2="Ir para o ínicio"
          />

          <ModalMessage
            title={[messageFalhaCadastroVeiculo]}
            className="modalFalha"
            show={falhaCadastroVeiculo}
            onHide={() => setFalhaCadastroVeiculo(false)}
            textbutton="Tentar novamente"
            textbutton2="Ir para o ínicio"
          />
        </div>
      </form>
    </div>
  )
}

export default CadastroVeiculos
