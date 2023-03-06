import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorForm } from 'components/FormTalao/ErrorForm'
import { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import Select from 'react-select'
import { AuthContext } from '../../contexts/AuthContext'
import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalEdicaoProprietarioProps {
  readonly id: number
  readonly codigoProprietario: number
  readonly municipioId: number
  readonly municipio: string
  readonly nome: string
  readonly show: boolean
  readonly cpf: string
  readonly cnh: string
  readonly categoriaCNH: string
  readonly endereco: string
  readonly numeroEndereco: string
  readonly complemento: string
  readonly cep: string
  readonly bairro: string
  readonly estado: string
  readonly email: string
  readonly celular: string
  readonly textbutton: string
  readonly textbutton2: string
  readonly onHide: () => void
  readonly onClick: () => void
}

function ModalEdicaoProprietario({
  id,
  codigoProprietario,
  nome,
  cnh,
  categoriaCNH,
  endereco,
  numeroEndereco,
  complemento,
  cep,
  bairro,
  estado,
  municipio,
  municipioId,
  email,
  celular,
  cpf,
  show,
  textbutton,
  textbutton2,
  onClick,
  onHide,
  ...rest
}: ModalEdicaoProprietarioProps) {
  const [nomeEditadoProprietario, setNomeEditadoProprietario] = useState(nome)
  const [enderecoEditadoProprietario, setEnderecoEditadoProprietario] = useState(endereco)
  const [numeroEnderecoEditadoProprietario, setNumeroEnderecoEditadoProprietario] = useState(numeroEndereco)
  const [cepEditadoProprietario, setCepEditadoProprietario] = useState(cep)
  const [complementoEditadoProprietario, setComplementoEditadoProprietario] = useState(complemento)
  const [bairroEditadoProprietario, setBairroEditadoProprietario] = useState(bairro)
  const [estadoEditadoProprietario, setEstadoEditadoProprietario] = useState(estado)
  const [idMunicipioEditadoProprietario, setIdMunicipioEditadoProprietario] = useState(municipioId)
  const [municipioEditadoProprietario, setMunicipioEditadoProprietario] = useState(municipio)
  const [emailEditadoProprietario, setEmailEditadoProprietario] = useState(email)
  const [celularEditadoProprietario, setCelularEditadoProprietario] = useState(celular)
  const [cnhEditadoProprietario] = useState(cnh)
  const [categoriaCnhEditadoProprietario] = useState(categoriaCNH)
  const [cpfEditadoProprietario, setCpfEditadoProprietario] = useState(cpf)

  const [successEditProprietario, setSuccessEditProprietario] = useState(false)
  const [modalSuccessEditProprietarioShow, setModalSuccessEditProprietarioShow] = useState(false)
  const [messageSuccessEditProprietario, setMessageSuccessEditProprietario] = useState('')
  const [falhaEditProprietario, setFalhaEditProprietario] = useState(false)
  const [modalFalhaEditProprietarioShow, setModalFalhaEditProprietarioShow] = useState(false)
  const [messageFalhaEditProprietario, setMessageFalhaEditProprietario] = useState([])

  // console.log(messageFalhaEditProprietario)

  const {
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
    setIdMunicipio,
    uf,
    setUf
  } = useContext(DadosContext)

  useEffect(() => {
    if (celularEditadoProprietario !== '') {
      setTelefoneEdicaoProprietarioValue(celularEditadoProprietario)
    }
    if (cepEditadoProprietario !== '') {
      setCepEdicaoProprietarioValue(cepEditadoProprietario)
    }
    if (municipioEditadoProprietario !== '') {
      setTextMunicipio(municipioEditadoProprietario)
    }
    if (idMunicipioEditadoProprietario !== 0) {
      setIdMunicipio(idMunicipioEditadoProprietario)
    }
    if (estadoEditadoProprietario !== '') {
      setUf(estadoEditadoProprietario)
    }
  }, [
    celularEditadoProprietario,
    cepEditadoProprietario,
    estadoEditadoProprietario,
    municipioEditadoProprietario,
    idMunicipioEditadoProprietario
  ])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({})

  const formAtualizaProprietario = () => {
    const dadosAtualizaProprietario = {
      id,
      nome: nomeEditadoProprietario.trim(),
      endereco: enderecoEditadoProprietario.trim(),
      numeroEndereco: numeroEnderecoEditadoProprietario.length > 0 ? numeroEnderecoEditadoProprietario.trim() : null,
      complemento: complementoEditadoProprietario.length > 0 ? complementoEditadoProprietario.trim() : null,
      cep:
        cepEditadoProprietario.length > 0 && cep === cepEditadoProprietario
          ? cepEditadoProprietario
          : cepEdicaoProprietarioValue.length > 0
          ? cepEdicaoProprietarioValue.trim()
          : null,
      bairro: bairroEditadoProprietario.length > 0 ? bairroEditadoProprietario.trim() : null,
      estado: estadoEditadoProprietario.length > 0 ? estadoEditadoProprietario : uf,
      municipioId: idMunicipio,
      email: emailEditadoProprietario.length > 0 ? emailEditadoProprietario.trim() : null,
      celular:
        celularEditadoProprietario.length > 0 && celular === celularEditadoProprietario
          ? celularEditadoProprietario
          : telefoneEdicaoProprietarioValue
          ? telefoneEdicaoProprietarioValue.trim()
          : null
    }

    api
      .put('Proprietario/atualizar-proprietario', dadosAtualizaProprietario)

      .then((response) => {
        if (response.status === 200) {
          setMessageSuccessEditProprietario(response.data.message)
          setSuccessEditProprietario(true)
          setModalSuccessEditProprietarioShow(true)
          atualizaProprietarios()
          clearInputsControlados()
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          if (error.response.data.message) {
            setMessageFalhaEditProprietario([error.response.data.message])
            setFalhaEditProprietario(true)
            setModalFalhaEditProprietarioShow(true)
          } else {
            const mensagensErro = Object.values(error.response.data.errors)
            setMessageFalhaEditProprietario(mensagensErro.map((mensagens) => mensagens.toString()))
            setFalhaEditProprietario(true)
            setModalFalhaEditProprietarioShow(true)
          }
        }
      })
  }

  async function clearInputsControlados() {
    setTextMunicipio('')
    setUf('')
    // setTelefoneEdicaoProprietarioValue('')
    // setCepEdicaoProprietarioValue('')
  }

  return (
    <>
      {!successEditProprietario && !falhaEditProprietario && (
        <Modal
          {...rest}
          show={show}
          dialogClassName="modalMedio"
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <div className="headerModalEdit">
              <h4>Editar Proprietário</h4>
            </div>

            <div className="bodyModalEdit">
              <form className="formEdicaoAgente" onSubmit={handleSubmit(formAtualizaProprietario)}>
                <div className="editaProprietario">
                  <div className="labelForm col-11">
                    <input
                      type="text"
                      name="nomeEdicaoProprietario"
                      placeholder="Nome"
                      className="form-control"
                      id="nomeEdicaoProprietario"
                      {...register('nomeEdicaoProprietario')}
                      value={nomeEditadoProprietario}
                      onChange={(e) => setNomeEditadoProprietario(e.target.value)}
                      required
                    />
                    <label htmlFor="nomeEdicaoProprietario">Nome</label>
                    {/* {errors?.nomeEdicaoProprietario?.type && nomeEditadoProprietario.length === 0 && <ErrorForm />} */}
                  </div>

                  <div className="labelForm col-11 col-md-6">
                    <input
                      type="text"
                      name="cpfEdicaoProprietario"
                      placeholder="CPF/CNPJ"
                      className="form-control"
                      id="cpfEdicaoProprietario"
                      defaultValue={cpfEditadoProprietario}
                      readOnly
                      disabled
                    />
                    <label htmlFor="cpfEdicaoProprietario">CPF/CNPJ</label>
                  </div>

                  <div className="labelForm col-11 col-md-5">
                    <input
                      type="text"
                      name="emailEdicaoProprietario"
                      placeholder="E-mail"
                      className="form-control"
                      id="emailEdicaoProprietario"
                      value={emailEditadoProprietario}
                      onChange={(e) => setEmailEditadoProprietario(e.target.value)}
                    />
                    <label htmlFor="emailEdicaoProprietario">E-mail</label>
                  </div>

                  <div className="labelForm col-11 col-md-6">
                    <input
                      type="text"
                      name="celularEdicaoProprietario"
                      placeholder="Celular"
                      className="form-control"
                      id="celularEdicaoProprietario"
                      {...register('celularEdicaoProprietario')}
                      value={telefoneEdicaoProprietarioValue}
                      onChange={inputTelefoneEdicaoProprietarioMask}
                      onBlur={() => setCelularEditadoProprietario(telefoneEdicaoProprietarioValue)}
                    />
                    <label htmlFor="celularEdicaoProprietario">Celular</label>
                  </div>

                  <div className="labelForm col-11 col-md-5">
                    <input
                      type="text"
                      name="cepEdicaoProprietario"
                      placeholder="Endereço"
                      className="form-control"
                      id="cepEdicaoProprietario"
                      value={cepEdicaoProprietarioValue}
                      onChange={inputCepEdicaoProprietarioMask}
                      onBlur={() => setCepEditadoProprietario(cepEdicaoProprietarioValue)}
                      required
                    />
                    <label htmlFor="cepEdicaoProprietario">CEP</label>
                    {/* {errors?.cepEdicaoProprietario?.type && cepEdicaoProprietarioValue.length === 0 && <ErrorForm />} */}
                  </div>

                  <div className="labelForm col-11 col-md-8">
                    <input
                      type="text"
                      name="enderecoEdicaoProprietario"
                      placeholder="Endereço"
                      className="form-control"
                      id="enderecoEdicaoProprietario"
                      value={enderecoEditadoProprietario}
                      onChange={(e) => setEnderecoEditadoProprietario(e.target.value)}
                      required
                    />
                    <label htmlFor="enderecoEdicaoProprietario">Endereço</label>
                    {/* {errors?.enderecoEdicaoProprietario?.type && enderecoEditadoProprietario.length === 0 && (
                      <ErrorForm />
                    )} */}
                  </div>

                  <div className="labelForm col-11 col-md-3">
                    <input
                      type="text"
                      name="numeroEnderecoEdicaoProprietario"
                      placeholder="Nº"
                      className="form-control"
                      id="numeroEnderecoEdicaoProprietario"
                      value={numeroEnderecoEditadoProprietario}
                      onChange={(e) => setNumeroEnderecoEditadoProprietario(e.target.value)}
                    />
                    <label htmlFor="numeroEnderecoEdicaoProprietario">Nº</label>
                  </div>

                  <div className="labelForm col-6">
                    <input
                      type="text"
                      className="municipios form-control"
                      name="municipioEdicaoProprietario"
                      id="municipioEdicaoProprietario"
                      placeholder="Município"
                      {...register('municipioEdicaoProprietario')}
                      value={textMunicipio}
                      onChange={onChangeMunicipio}
                      required
                    />
                    <label htmlFor="municipioEdicaoProprietario"> Município </label>

                    {filterMunicipio.length > 0 && (
                      <div className="optionsMunicipios col-12">
                        {filterMunicipio.map((dado) => (
                          <div className="listaMunicipios" key={dado.id} onClick={() => selecionaMunicipio(dado)}>
                            {dado.nome}
                          </div>
                        ))}
                      </div>
                    )}

                    {errors?.municipioEdicaoProprietario?.type && textMunicipio.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-5">
                    <input
                      type="text"
                      className="form-control"
                      name="estadoEnderecoNovoProprietario"
                      id="estadoEnderecoNovoProprietario"
                      placeholder="Estado"
                      {...register('estadoEnderecoNovoProprietario')}
                      value={uf}
                      readOnly
                      disabled
                    />
                    <label htmlFor="estadoEnderecoNovoProprietario">Estado</label>
                    {/* <Select
                      className="selectTipoInfracao col-12"
                      name="estadoNovoProprietario"
                      id="estadoNovoProprietario"
                      placeholder="Estado"
                      inputValue={uf}
                      // onChange={(e) => console.log(e)}
                    /> */}
                  </div>

                  <div className="labelForm col-11 col-md-5">
                    <input
                      type="text"
                      name="complementoEdicaoProprietario"
                      placeholder="Complemento"
                      className="form-control"
                      id="complementoEdicaoProprietario"
                      value={complementoEditadoProprietario}
                      onChange={(e) => setComplementoEditadoProprietario(e.target.value)}
                    />
                    <label htmlFor="complementoEdicaoProprietario">Complemento</label>
                  </div>

                  <div className="labelForm col-11 col-md-6">
                    <input
                      type="text"
                      name="bairroEdicaoProprietario"
                      placeholder="Bairro"
                      className="form-control"
                      id="bairroEdicaoProprietario"
                      value={bairroEditadoProprietario}
                      onChange={(e) => setBairroEditadoProprietario(e.target.value)}
                      required
                    />
                    <label htmlFor="bairroEdicaoProprietario">Bairro</label>
                    {/* {errors?.bairroEdicaoProprietario?.type && bairroEditadoProprietario.length === 0 && <ErrorForm />} */}
                  </div>

                  <div className="buttonsModalEdit mt-3">
                    {/* <ButtonSubmit text={'Salvar'} onClick={handleSubmit(formAtualizaProprietario)}></ButtonSubmit> */}
                    <Button type="submit" variant="none" className="buttonSave">
                      {textbutton}
                    </Button>
                    <Button
                      onClick={() => [onHide(), clearInputsControlados()]}
                      variant="none"
                      className="buttonCancel"
                    >
                      {textbutton2}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {successEditProprietario && (
        <ModalMessage
          title={[messageSuccessEditProprietario]}
          className="modalSuccess"
          show={modalSuccessEditProprietarioShow}
          onHide={() => [setModalSuccessEditProprietarioShow(false), onClick()]}
          textbutton="OK"
        />
      )}

      {falhaEditProprietario && (
        <ModalMessage
          title={messageFalhaEditProprietario}
          className="modalFalha"
          show={modalFalhaEditProprietarioShow}
          onHide={() => [setModalFalhaEditProprietarioShow(false), onClick()]}
          textbutton="OK"
        />
      )}
    </>
  )
}

export default ModalEdicaoProprietario
