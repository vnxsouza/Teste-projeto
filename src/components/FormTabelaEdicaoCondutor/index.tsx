/* eslint-disable import-helpers/order-imports */
import React, { useContext, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { DadosContext } from 'contexts/DadosContext'
import Table from 'react-bootstrap/Table'
import api from 'services/api'
import ModalMessage from 'components/ModalMessage'
import Select from 'react-select'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { ErrorForm } from 'components/FormTalao/ErrorForm'

function FormTabelaEdicaoCondutor() {
  const {
    Condutores,
    condutoresSelecionados,
    condutoresInativos,
    setCondutoresInativos,
    atualizaCondutores,
    setProprietariosSelecionados,
    setCondutoresSelecionados,
    telefoneEdicaoCondutorValue,
    setTelefoneEdicaoCondutorValue,
    inputTelefoneEdicaoCondutorMask,
    cepEdicaoCondutorValue,
    setCepEdicaoCondutorValue,
    inputCepEdicaoCondutorMask,
    Permissionarios,
    textMunicipio,
    setTextMunicipio,
    onChangeMunicipio,
    filterMunicipio,
    selecionaMunicipio,
    idMunicipio,
    uf,
    setUf,
    atualizaPermissionarios
  } = useContext(DadosContext)

  const [idCondutorSelecionado, setIdCondutorSelecionado] = useState(null)
  const [detailsCondutor, setDetailsCondutor] = useState({})
  const [nomeCondutor, setNomeCondutor] = useState('')
  const [codigoCondutor, setCodigoCondutor] = useState(0)
  const [cpfCondutor, setCpfCondutor] = useState('')
  const [cnhCondutor, setCnhCondutor] = useState('')
  const [categoriaCnhCondutor, setCategoriaCnhCondutor] = useState('')
  const [emailCondutor, setEmailCondutor] = useState('')
  const [telefoneCondutor, setTelefoneCondutor] = useState('')
  const [cepCondutor, setCepCondutor] = useState('')
  const [enderecoCondutor, setEnderecoCondutor] = useState('')
  const [numeroEnderecoCondutor, setNumeroEnderecoCondutor] = useState('')
  const [complementoCondutor, setComplementoCondutor] = useState('')
  const [bairroCondutor, setBairroCondutor] = useState('')
  const [estadoCondutor, setEstadoCondutor] = useState('')
  const [municipioCondutor, setMunicipioCondutor] = useState('')

  const optionsCategoriaCnh = [
    { value: 1, label: 'A' },
    { value: 2, label: 'B' },
    { value: 3, label: 'C' },
    { value: 4, label: 'D' },
    { value: 5, label: 'E' }
  ]

  const [textCategoriaCnh, setTextCategoriaCnh] = useState([])

  const mostraDetalhesCondutor = (dado, valor) => () => {
    setDetailsCondutor((state) => ({
      [valor]: !state[valor]
    }))

    setIdCondutorSelecionado(dado.id)
    setNomeCondutor(dado.nome)
    setCodigoCondutor(dado.codigo)
    setCpfCondutor(dado.cpF_CNPJ)
    setCnhCondutor(dado.cnh)
    setCategoriaCnhCondutor(dado.categoriaCNH)
    setEmailCondutor(dado.email)
    setTelefoneEdicaoCondutorValue(dado.celular)
    setCepEdicaoCondutorValue(dado.cep)
    setEnderecoCondutor(dado.endereco)
    setBairroCondutor(dado.bairro)
    setNumeroEnderecoCondutor(dado.numeroEndereco)
    setComplementoCondutor(dado.complemento)
    setUf(dado.municipio.uf)
    setTextMunicipio(dado.municipio.nome)
  }

  const [modalSuccessEdicaoCondutor, setModalSuccessEdicaoCondutor] = useState(false)
  const [modalFalhaEdicaoCondutor, setModalFalhaEdicaoCondutor] = useState(false)
  const [messageSuccessModalEdicaoCondutor, setMessageSuccessModalEdicaoCondutor] = useState('')
  const [messageFalhaModalEdicaoCondutor, setMessageFalhaModalEdicaoCondutor] = useState([])

  const onChangeCondutoresInativos = (e) => {
    const id = e

    if (condutoresInativos.length === 0) {
      setCondutoresInativos([id])
    } else if (condutoresInativos.includes(id)) {
      setCondutoresInativos(condutoresInativos.filter((item) => item !== id))
    } else {
      setCondutoresInativos([...condutoresInativos, id])
    }
  }

  // function clearInputControlados() {
  //   setUf('')
  //   setTelefoneEdicaoCondutorValue('')
  //   setCepEdicaoCondutorValue('')
  //   setTextCategoriaCnh([])
  // }

  // const validaEdicaoCondutor = yup.object({
  //   nomeEdicaoCondutor: yup.string().required(),
  //   categoriaCnhEdicaoCondutor: yup.number().required(),
  //   enderecoEdicaoCondutor: yup.string().required(),
  //   municipioEdicaoCondutor: yup.string().required(),
  //   cepEdicaoCondutor: yup.string().required(),
  //   bairroEdicaoCondutor: yup.string().required()
  // })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({})

  function atualizaCondutor() {
    const dadosAtualizacaoCondutor = {
      id: idCondutorSelecionado,
      nome: nomeCondutor.trim(),
      cnh: cnhCondutor.length > 0 ? cnhCondutor.trim() : null,
      categoriaCNH: categoriaCnhCondutor,
      endereco: enderecoCondutor.length > 0 ? enderecoCondutor.trim() : null,
      numeroEndereco:
        numeroEnderecoCondutor !== null && numeroEnderecoCondutor.length > 0 ? numeroEnderecoCondutor.trim() : null,
      complemento: complementoCondutor !== null && complementoCondutor.length > 0 ? complementoCondutor.trim() : null,
      cep: cepEdicaoCondutorValue.trim(),
      bairro: bairroCondutor.trim(),
      estado: uf,
      municipioId: idMunicipio,
      email: emailCondutor !== null && emailCondutor.length > 0 ? emailCondutor.trim() : null,
      celular:
        telefoneEdicaoCondutorValue !== null && telefoneEdicaoCondutorValue.length > 0
          ? telefoneEdicaoCondutorValue.trim()
          : null
    }

    console.log(dadosAtualizacaoCondutor)

    api
      .put('Condutor/atualizar-condutor', dadosAtualizacaoCondutor)
      .then((response) => {
        if (response.status === 200) {
          setModalSuccessEdicaoCondutor(true)
          setMessageSuccessModalEdicaoCondutor(response.data.message)
          atualizaCondutores()
          // clearInputControlados()
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          if (error.response.data.message) {
            setMessageFalhaModalEdicaoCondutor([error.response.data.message])
            setModalFalhaEdicaoCondutor(true)
          } else {
            const mensagensErro = Object.values(error.response.data.errors)
            setMessageFalhaModalEdicaoCondutor(mensagensErro.map((mensagens) => mensagens.toString()))
            setModalFalhaEdicaoCondutor(true)
          }
        }
      })
  }

  return (
    <div className="tabelaAgentes container">
      <Table striped bordered>
        <thead>
          <tr>
            <th className="headerTabela">Código</th>

            <th className="headerTabela">Nome</th>

            <th className="headerTabela">CPF/CNPJ</th>

            <th className="headerTabela">Endereço</th>

            <th className="headerTabela">E-mail</th>

            <th className="headerTabela">Celular</th>

            <th className="headerTabela"> </th>
          </tr>
        </thead>
        {Condutores.map(
          (dado, valor) =>
            condutoresSelecionados.includes(dado.id) && (
              <tbody key={dado.id}>
                <tr className="linhaAgentes">
                  <td className="dadoTabela">
                    <span className={condutoresInativos.includes(dado.id) ? 'textNomeAgenteInativo' : ''}>
                      {dado.codigo || ''}
                    </span>
                  </td>
                  <td className="dadoTabela">
                    <span className={condutoresInativos.includes(dado.id) ? 'textNomeAgenteInativo' : ''}>
                      {dado.nome}
                    </span>
                  </td>
                  <td className="dadoTabela">
                    <span className={condutoresInativos.includes(dado.id) ? 'textNomeAgenteInativo' : ''}>
                      {dado.cpf}
                    </span>
                  </td>
                  <td className="dadoTabela">
                    <span className={condutoresInativos.includes(dado.id) ? 'textNomeAgenteInativo' : ''}>
                      {dado.endereco}
                    </span>
                  </td>
                  <td className="dadoTabela">
                    <span className={condutoresInativos.includes(dado.id) ? 'textNomeAgenteInativo' : ''}>
                      {dado.email}
                    </span>
                  </td>
                  <td className="dadoTabela">
                    <span className={condutoresInativos.includes(dado.id) ? 'textNomeAgenteInativo' : ''}>
                      {dado.celular}
                    </span>
                  </td>
                  <td className="dadoTabela">
                    <span className="detailsProprietario" onClick={mostraDetalhesCondutor(dado, valor)}>
                      Detalhes
                    </span>
                  </td>
                </tr>

                {detailsCondutor[valor] && (
                  <tr>
                    <td colSpan={7}>
                      <form className="form-talao" onSubmit={handleSubmit(atualizaCondutor)}>
                        <div className="labelForm col-5 col-md-9">
                          <input
                            type="text"
                            name="nomeEdicaoCondutor"
                            id="nomeEdicaoCondutor"
                            className="form-control"
                            // {...register('nomeEdicaoCondutor')}
                            value={nomeCondutor}
                            onChange={(e) => setNomeCondutor(e.target.value)}
                            required
                          />
                          <label htmlFor="nomeEdicaoCondutor"> Nome </label>
                          {errors?.nomeEdicaoCondutor?.type && nomeCondutor.length === 0 && <ErrorForm />}
                        </div>

                        <div className="labelForm col-5 col-md-3">
                          <input
                            type="text"
                            name="codigoCondutor"
                            id="codigoCondutor"
                            className="form-control"
                            placeholder="Código"
                            value={codigoCondutor || ''}
                            onChange={(e) => setCodigoCondutor(Number(e.target.value))}
                            readOnly
                            disabled
                          />
                          <label htmlFor="codigoCondutor"> Código </label>
                        </div>

                        <div className="labelForm col-5 col-md-4">
                          <input
                            type="text"
                            name="cpfCondutor"
                            id="cpfCondutor"
                            className="form-control"
                            value={cpfCondutor || ''}
                            disabled
                          />
                          <label htmlFor="cpfCondutor"> CPF/CNPJ </label>
                        </div>

                        <div className="labelForm col-5 col-md-4">
                          <input
                            type="text"
                            name="cnhCondutor"
                            id="cnhCondutor"
                            className="form-control"
                            value={cnhCondutor}
                            disabled
                          />
                          <label htmlFor="cnhCondutor"> CNH </label>
                        </div>

                        <div className="labelForm col-5 col-md-4">
                          <input
                            type="text"
                            name="categoriaCnhCondutor"
                            id="categoriaCnhCondutor"
                            className="form-control"
                            value={
                              categoriaCnhCondutor === '1'
                                ? 'A'
                                : categoriaCnhCondutor === '2'
                                ? 'B'
                                : categoriaCnhCondutor === '3'
                                ? 'C'
                                : categoriaCnhCondutor === '4'
                                ? 'D'
                                : categoriaCnhCondutor === '5'
                                ? 'E'
                                : categoriaCnhCondutor
                            }
                            disabled
                          />
                          <label htmlFor="categoriaCnhCondutor"> Categoria/CNH </label>
                        </div>

                        {/* <div className="labelForm col-4">
                          <Select
                            className="selectTipoInfracao col-12"
                            options={optionsCategoriaCnh}
                            name="categoriaCnhNovoCondutor"
                            id="categoriaCnhNovoCondutor"
                            placeholder="Categoria/CNH"
                            value={textCategoriaCnh}
                            onChange={(e) => (e !== null ? setTextCategoriaCnh(e) : setTextCategoriaCnh([]))}
                            isClearable
                          />
                        </div> */}

                        <div className="labelForm col-5 col-md-6">
                          <input
                            type="text"
                            name="emailEdicaoCondutor"
                            id="emailEdicaoCondutor"
                            className="form-control"
                            // {...register('emailEdicaoCondutor')}
                            value={emailCondutor || ''}
                            onChange={(e) => setEmailCondutor(e.target.value)}
                          />
                          <label htmlFor="emailEdicaoCondutor"> E-mail </label>
                        </div>

                        <div className="labelForm col-5 col-md-6">
                          <input
                            type="text"
                            name="telefoneEdicaoCondutor"
                            id="telefoneEdicaoCondutor"
                            className="form-control"
                            // {...register('telefoneEdicaoCondutor')}
                            value={telefoneEdicaoCondutorValue || ''}
                            onChange={inputTelefoneEdicaoCondutorMask}
                          />
                          <label htmlFor="telefoneEdicaoCondutor"> Celular </label>
                        </div>

                        <div className="labelForm col-5 col-md-4">
                          <input
                            type="text"
                            name="cepEdicaoCondutor"
                            id="cepEdicaoCondutor"
                            className="form-control"
                            // {...register('cepEdicaoCondutor')}
                            value={cepEdicaoCondutorValue || ''}
                            onChange={inputCepEdicaoCondutorMask}
                            required
                          />
                          <label htmlFor="cepEdicaoCondutor"> CEP </label>
                          {errors?.cepEdicaoCondutor?.type && cepEdicaoCondutorValue.length === 0 && <ErrorForm />}
                        </div>

                        <div className="labelForm col-5 col-md-8">
                          <input
                            type="text"
                            name="enderecoEdicaoCondutor"
                            id="enderecoEdicaoCondutor"
                            className="form-control"
                            // {...register('enderecoEdicaoCondutor')}
                            value={enderecoCondutor || ''}
                            onChange={(e) => setEnderecoCondutor(e.target.value)}
                            required
                          />
                          <label htmlFor="enderecoEdicaoCondutor"> Endereço </label>
                          {errors?.enderecoEdicaoCondutor?.type && enderecoCondutor.length === 0 && <ErrorForm />}
                        </div>

                        <div className="labelForm col-5 col-md-2">
                          <input
                            type="text"
                            name="numeroEnderecoEdicaoCondutor"
                            id="numeroEnderecoEdicaoCondutor"
                            className="form-control"
                            // {...register('numeroEnderecoEdicaoCondutor')}
                            value={numeroEnderecoCondutor || ''}
                            onChange={(e) => setNumeroEnderecoCondutor(e.target.value)}
                          />
                          <label htmlFor="numeroEnderecoEdicaoCondutor"> Número </label>
                        </div>

                        <div className="labelForm col-5 col-md-5">
                          <input
                            type="text"
                            name="complementoEdicaoCondutor"
                            id="complementoEdicaoCondutor"
                            className="form-control"
                            // {...register('complementoEdicaoCondutor')}
                            value={complementoCondutor || ''}
                            onChange={(e) => setComplementoCondutor(e.target.value)}
                          />
                          <label htmlFor="complementoEdicaoCondutor"> Complemento </label>
                        </div>

                        <div className="labelForm col-5 col-md-5">
                          <input
                            type="text"
                            name="bairroEdicaoCondutor"
                            id="bairroEdicaoCondutor"
                            className="form-control"
                            // {...register('bairroEdicaoCondutor')}
                            defaultValue={bairroCondutor || ''}
                            onChange={(e) => setBairroCondutor(e.target.value)}
                            required
                          />
                          <label htmlFor="bairroEdicaoCondutor"> Bairro </label>
                          {errors?.bairroEdicaoCondutor?.type && bairroCondutor.length === 0 && <ErrorForm />}
                        </div>

                        <div className="labelForm col-9">
                          <input
                            type="text"
                            className="municipios form-control"
                            name="municipioEdicaoCondutor"
                            id="municipioEdicaoCondutor"
                            placeholder="Município"
                            // {...register('municipioEdicaoCondutor')}
                            value={textMunicipio || ''}
                            onChange={onChangeMunicipio}
                            required
                          />
                          <label htmlFor="municipioEdicaoCondutor"> Município </label>

                          {filterMunicipio.length > 0 && (
                            <div className="optionsMunicipios col-12">
                              {filterMunicipio.map((municipio) => (
                                <div
                                  className="listaMunicipios"
                                  key={municipio.id}
                                  onClick={() => selecionaMunicipio(municipio)}
                                >
                                  {municipio.nome}
                                </div>
                              ))}
                            </div>
                          )}

                          {errors?.municipioEdicaoCondutor?.type && textMunicipio.length === 0 && <ErrorForm />}
                        </div>

                        <div className="labelForm col-3">
                          <input
                            type="text"
                            className="form-control"
                            name="estadoEnderecoEdicaoCondutor"
                            id="estadoEnderecoEdicaoCondutor"
                            // {...register('estadoEnderecoEdicaoCondutor')}
                            placeholder="Estado"
                            value={uf}
                            readOnly
                            disabled
                          />
                          <label htmlFor="estadoEnderecoEdicaoCondutor">Estado</label>
                        </div>

                        <div className="botaoFormDetails">
                          {
                            /* dado.dataInativo !== null || */ condutoresInativos.includes(dado.id) ? (
                              <Button
                                onClick={() => [onChangeCondutoresInativos(dado.id), setDetailsCondutor(false)]}
                                sx={{ mr: 1 }}
                                className="buttonBack"
                              >
                                Reativar condutor
                              </Button>
                            ) : (
                              <Button
                                onClick={() => [onChangeCondutoresInativos(dado.id), setDetailsCondutor(false)]}
                                sx={{ mr: 1 }}
                                className="buttonBack"
                              >
                                Desativar condutor
                              </Button>
                            )
                          }

                          <Button type="submit" sx={{ mr: 1 }} className="buttonSaveDetails">
                            Salvar
                          </Button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
              </tbody>
            )
        )}
      </Table>

      {modalSuccessEdicaoCondutor && (
        <ModalMessage
          title={[messageSuccessModalEdicaoCondutor]}
          className="modalSuccess"
          show={modalSuccessEdicaoCondutor}
          onHide={() => [setModalSuccessEdicaoCondutor(false), setDetailsCondutor(false)]}
          textbutton="Ok"
          textbutton2="Ir para o ínicio"
        />
      )}

      {modalFalhaEdicaoCondutor && (
        <ModalMessage
          title={messageFalhaModalEdicaoCondutor}
          className="modalFalha"
          show={modalFalhaEdicaoCondutor}
          onHide={() => [setModalFalhaEdicaoCondutor(false), setDetailsCondutor(false)]}
          textbutton="Ok"
          textbutton2="Ir para o ínicio"
        />
      )}
    </div>
  )
}

export default FormTabelaEdicaoCondutor
