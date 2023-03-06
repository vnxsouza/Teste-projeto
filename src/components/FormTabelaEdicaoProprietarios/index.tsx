/* eslint-disable import-helpers/order-imports */
import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { DadosContext } from 'contexts/DadosContext'
import Table from 'react-bootstrap/Table'
import { BiCurrentLocation } from 'react-icons/bi'
import api from 'services/api'
import ModalMessage from 'components/ModalMessage'
import { useForm } from 'react-hook-form'

function FormTabelaEdicaoProprietarios() {
  const {
    Proprietarios,
    proprietariosSelecionados,
    idProprietarioAtual,
    setIdProprietarioAtual,
    atualizaProprietarios,
    telefoneEdicaoProprietarioValue,
    setTelefoneEdicaoProprietarioValue,
    inputTelefoneEdicaoProprietarioMask,
    cepEdicaoProprietarioValue,
    setCepEdicaoProprietarioValue,
    inputCepEdicaoProprietarioMask,
    textMunicipio,
    setTextMunicipio,
    onChangeMunicipio,
    filterMunicipio,
    selecionaMunicipio,
    idMunicipio,
    uf,
    setUf
  } = useContext(DadosContext)

  const [showIcon, setShowIcon] = useState({})

  const mostraIcon = (valor) => () => {
    setShowIcon((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }
  const [idProprietarioSelecionado, setIdProprietarioSelecionado] = useState(null)
  const [detailsProprietario, setDetailsProprietario] = useState({})
  const [nomeProprietario, setNomeProprietario] = useState('')
  const [cpfProprietario, setCpfProprietario] = useState('')
  const [emailProprietario, setEmailProprietario] = useState('')
  const [telefoneProprietario, setTelefoneProprietario] = useState('')
  const [cepProprietario, setCepProprietario] = useState('')
  const [enderecoProprietario, setEnderecoProprietario] = useState('')
  const [numeroEnderecoProprietario, setNumeroEnderecoProprietario] = useState('')
  const [complementoProprietario, setComplementoProprietario] = useState('')
  const [bairroProprietario, setBairroProprietario] = useState('')
  const [estadoProprietario, setEstadoProprietario] = useState('')
  const [municipioProprietario, setMunicipioProprietario] = useState('')

  const [modalSuccessEdicaoProprietario, setModalSuccessEdicaoProprietario] = useState(false)
  const [modalFalhaEdicaoProprietario, setModalFalhaEdicaoProprietario] = useState(false)
  const [messageSuccessModalEdicaoProprietario, setMessageSuccessModalEdicaoProprietario] = useState('')
  const [messageFalhaModalEdicaoProprietario, setMessageFalhaModalEdicaoProprietario] = useState([])

  const mostraDetalhesProprietario = (dado, valor) => () => {
    setDetailsProprietario((state) => ({
      [valor]: !state[valor]
    }))

    setIdProprietarioSelecionado(dado.id)
    setNomeProprietario(dado.nome)
    setCpfProprietario(dado.cpF_CNPJ)
    setEmailProprietario(dado.email)
    setTelefoneEdicaoProprietarioValue(dado.celular)
    setCepEdicaoProprietarioValue(dado.cep)
    setEnderecoProprietario(dado.endereco)
    setNumeroEnderecoProprietario(dado.numeroEndereco)
    setComplementoProprietario(dado.complemento)
    setUf(dado.municipio.uf)
    setTextMunicipio(dado.municipio.nome)
  }

  // function clearInputsControlados() {
  //   setTextMunicipio('')
  //   setUf('')
  //   setTelefoneEdicaoProprietarioValue('')
  //   setCepEdicaoProprietarioValue('')
  // }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({})

  function atualizaProprietario() {
    const dadosAtualizacaoProprietario = {
      id: idProprietarioSelecionado,
      nome: nomeProprietario.trim(),
      endereco: enderecoProprietario.length > 0 ? enderecoProprietario.trim() : null,
      numeroEndereco:
        numeroEnderecoProprietario !== null && numeroEnderecoProprietario.length > 0
          ? numeroEnderecoProprietario.trim()
          : null,
      complemento:
        complementoProprietario !== null && complementoProprietario.length > 0 ? complementoProprietario.trim() : null,
      cep: cepEdicaoProprietarioValue.trim(),
      bairro: bairroProprietario.trim(),
      estado: uf,
      municipioId: idMunicipio,
      email: emailProprietario !== null && emailProprietario.length > 0 ? emailProprietario.trim() : null,
      celular:
        telefoneEdicaoProprietarioValue !== null && telefoneEdicaoProprietarioValue.length > 0
          ? telefoneEdicaoProprietarioValue.trim()
          : null
    }

    api
      .put('Proprietario/atualizar-proprietario', dadosAtualizacaoProprietario)
      .then((response) => {
        if (response.status === 200) {
          setModalSuccessEdicaoProprietario(true)
          setMessageSuccessModalEdicaoProprietario(response.data.message)
          atualizaProprietarios()
          // clearInputsControlados()
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          if (error.response.data.message) {
            setMessageFalhaModalEdicaoProprietario([error.response.data.message])
            setModalFalhaEdicaoProprietario(true)
          } else {
            const mensagensErro = Object.values(error.response.data.errors)
            setMessageFalhaModalEdicaoProprietario(mensagensErro.map((mensagens) => mensagens.toString()))
            setModalFalhaEdicaoProprietario(true)
          }
        }
      })
  }

  return (
    <div className="tabelaAgentes container">
      <Table striped bordered>
        <thead>
          <tr>
            <th className="headerTabela">Nome</th>

            <th className="headerTabela">CPF/CNPJ</th>

            <th className="headerTabela">Endereço</th>

            <th className="headerTabela">E-mail</th>

            <th className="headerTabela">Celular</th>

            <th className="headerTabela"> </th>
          </tr>
        </thead>
        {Proprietarios.map(
          (dado, valor) =>
            proprietariosSelecionados.includes(dado.id) && (
              <tbody key={dado.id}>
                <tr
                  className={dado.id === idProprietarioAtual ? 'linhaAgentesAtivo' : 'linhaAgentes'}
                  onMouseEnter={mostraIcon(valor)}
                  onMouseLeave={mostraIcon(valor)}
                >
                  <td className="dadoTabela">{dado.nome}</td>
                  <td className="dadoTabela">{dado.cpF_CNPJ}</td>
                  <td className="dadoTabela">{dado.endereco}</td>
                  <td className="dadoTabela">{dado.email}</td>
                  <td className="dadoTabela">{dado.celular}</td>
                  <td className="dadoTabela">
                    <span className="detailsProprietario" onClick={mostraDetalhesProprietario(dado, valor)}>
                      Detalhes
                    </span>

                    {showIcon[valor] && dado.id !== idProprietarioAtual && (
                      <div className="iconsModificacao">
                        <Tooltip title="Tornar proprietário atual" placement="top" arrow>
                          <div>
                            <BiCurrentLocation
                              size={30}
                              className="iconEdit"
                              onClick={() => setIdProprietarioAtual(dado.id)}
                            />
                          </div>
                        </Tooltip>
                      </div>
                    )}
                  </td>
                </tr>

                {detailsProprietario[valor] && (
                  <tr>
                    <td colSpan={6}>
                      <form className="form-talao" onSubmit={handleSubmit(atualizaProprietario)}>
                        <div className="labelForm col-5 col-md-8">
                          <input
                            type="text"
                            name="nomeEdicaoProprietario"
                            id="nomeEdicaoProprietario"
                            className="form-control"
                            value={nomeProprietario}
                            onChange={(e) => setNomeProprietario(e.target.value)}
                            disabled={dado.id !== idProprietarioAtual}
                            required
                          />
                          <label htmlFor="nomeEdicaoProprietario"> Nome </label>
                        </div>

                        <div className="labelForm col-5 col-md-4">
                          <input
                            type="text"
                            name="renavam"
                            id="renavam"
                            className="form-control"
                            value={dado.cpf}
                            readOnly
                            disabled
                          />
                          <label htmlFor="renavam"> CPF/CNPJ </label>
                        </div>

                        <div className="labelForm col-5 col-md-5">
                          <input
                            type="text"
                            name="emailEdicaoProprietario"
                            id="emailEdicaoProprietario"
                            className="form-control"
                            value={emailProprietario || ''}
                            onChange={(e) => setEmailProprietario(e.target.value)}
                            disabled={dado.id !== idProprietarioAtual}
                          />
                          <label htmlFor="emailEdicaoProprietario"> E-mail </label>
                        </div>

                        <div className="labelForm col-5 col-md-4">
                          <input
                            type="text"
                            name="telefoneEdicaoProprietario"
                            id="telefoneEdicaoProprietario"
                            className="form-control"
                            value={telefoneEdicaoProprietarioValue || ''}
                            onChange={inputTelefoneEdicaoProprietarioMask}
                            disabled={dado.id !== idProprietarioAtual}
                          />
                          <label htmlFor="telefoneEdicaoProprietario"> Celular </label>
                        </div>

                        <div className="labelForm col-5 col-md-3">
                          <input
                            type="text"
                            name="cepEdicaoProprietario"
                            id="cepEdicaoProprietario"
                            className="form-control"
                            value={cepEdicaoProprietarioValue || ''}
                            onChange={inputCepEdicaoProprietarioMask}
                            disabled={dado.id !== idProprietarioAtual}
                            required
                          />
                          <label htmlFor="cepEdicaoProprietario"> CEP </label>
                        </div>

                        <div className="labelForm col-5 col-md-10">
                          <input
                            type="text"
                            name="enderecoEdicaoProprietario"
                            id="enderecoEdicaoProprietario"
                            className="form-control"
                            value={enderecoProprietario || ''}
                            onChange={(e) => setEnderecoProprietario(e.target.value)}
                            disabled={dado.id !== idProprietarioAtual}
                            required
                          />
                          <label htmlFor="enderecoEdicaoProprietario"> Endereço </label>
                        </div>

                        <div className="labelForm col-5 col-md-2">
                          <input
                            type="text"
                            name="numeroEnderecoEdicaoProprietario"
                            id="numeroEnderecoEdicaoProprietario"
                            className="form-control"
                            value={numeroEnderecoProprietario || ''}
                            onChange={(e) => setNumeroEnderecoProprietario(e.target.value)}
                            disabled={dado.id !== idProprietarioAtual}
                          />
                          <label htmlFor="numeroEnderecoEdicaoProprietario"> Número </label>
                        </div>

                        <div className="labelForm col-5 col-md-6">
                          <input
                            type="text"
                            name="cor"
                            id="cor"
                            className="form-control"
                            value={complementoProprietario || ''}
                            onChange={(e) => setComplementoProprietario(e.target.value)}
                            disabled={dado.id !== idProprietarioAtual}
                          />
                          <label htmlFor="cor"> Complemento </label>
                        </div>

                        <div className="labelForm col-5 col-md-6">
                          <input
                            type="text"
                            name="cor"
                            id="cor"
                            className="form-control"
                            defaultValue={bairroProprietario || ''}
                            onChange={(e) => setBairroProprietario(e.target.value)}
                            disabled={dado.id !== idProprietarioAtual}
                            required
                          />
                          <label htmlFor="cor"> Bairro </label>
                        </div>

                        <div className="labelForm col-9">
                          <input
                            type="text"
                            className="municipios form-control"
                            name="municipioNovoProprietario"
                            id="municipioNovoProprietario"
                            placeholder="Município"
                            value={textMunicipio || ''}
                            onChange={onChangeMunicipio}
                            disabled={dado.id !== idProprietarioAtual}
                            required
                          />
                          <label htmlFor="municipioNovoProprietario"> Município </label>

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

                          {/* {errors?.municipio?.type && textMunicipio.length === 0 && <ErrorForm />} */}
                        </div>

                        <div className="labelForm col-3">
                          <input
                            type="text"
                            className="form-control"
                            name="estadoEnderecoNovoProprietario"
                            id="estadoEnderecoNovoProprietario"
                            placeholder="Estado"
                            value={uf}
                            readOnly
                            disabled
                          />
                          <label htmlFor="estadoEnderecoNovoProprietario">Estado</label>
                        </div>

                        {dado.id === idProprietarioAtual && (
                          <div className="botaoFormDetails">
                            <Button type="submit" sx={{ mr: 1 }} className="buttonSaveDetails col-2">
                              Salvar
                            </Button>
                          </div>
                        )}
                      </form>
                    </td>
                  </tr>
                )}
              </tbody>
            )
        )}
      </Table>

      {modalSuccessEdicaoProprietario && (
        <ModalMessage
          title={[messageSuccessModalEdicaoProprietario]}
          className="modalSuccess"
          show={modalSuccessEdicaoProprietario}
          onHide={() => [setModalSuccessEdicaoProprietario(false), setDetailsProprietario(false)]}
          textbutton="Ok"
          textbutton2="Ir para o ínicio"
        />
      )}

      {modalFalhaEdicaoProprietario && (
        <ModalMessage
          title={messageFalhaModalEdicaoProprietario}
          className="modalFalha"
          show={modalFalhaEdicaoProprietario}
          onHide={() => setModalFalhaEdicaoProprietario(false)}
          textbutton="Ok"
          textbutton2="Ir para o ínicio"
        />
      )}
    </div>
  )
}

export default FormTabelaEdicaoProprietarios
