import { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useForm } from 'react-hook-form'

import Select from 'react-select'
import { AuthContext } from '../../contexts/AuthContext'
import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'
import ModalMessage from '../ModalMessage'

interface ModalEdicaoCondutorProps {
  readonly id: number
  readonly codigoCondutor: number
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

function ModalEdicaoCondutor({
  id,
  codigoCondutor,
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
}: ModalEdicaoCondutorProps) {
  const [nomeEditadoCondutor, setNomeEditadoCondutor] = useState(nome)
  const [enderecoEditadoCondutor, setEnderecoEditadoCondutor] = useState(endereco)
  const [numeroEnderecoEditadoCondutor, setNumeroEnderecoEditadoCondutor] = useState(numeroEndereco)
  const [cepEditadoCondutor, setCepEditadoCondutor] = useState(cep)
  const [complementoEditadoCondutor, setComplementoEditadoCondutor] = useState(complemento)
  const [bairroEditadoCondutor, setBairroEditadoCondutor] = useState(bairro)
  const [estadoEditadoCondutor, setEstadoEditadoCondutor] = useState(estado)
  const [MunicipioEditadoCondutor, setMunicipioEditadoCondutor] = useState(municipioId)
  const [emailEditadoCondutor, setEmailEditadoCondutor] = useState(email)
  const [celularEditadoCondutor, setCelularEditadoCondutor] = useState(celular)
  const [cnhEditadoCondutor] = useState(cnh)
  const [categoriaCnhEditadoCondutor] = useState(categoriaCNH)
  const [cpfEditadoCondutor, setCpfEditadoCondutor] = useState(cpf)

  const [successEditCondutor, setSuccessEditCondutor] = useState(false)
  const [modalSuccessEditCondutorShow, setModalSuccessEditCondutorShow] = useState(false)
  const [messageSuccessEditCondutor, setMessageSuccessEditCondutor] = useState('')
  const [falhaEditCondutor, setFalhaEditCondutor] = useState(false)
  const [modalFalhaEditCondutorShow, setModalFalhaEditCondutorShow] = useState(false)
  const [messageFalhaEditCondutor, setMessageFalhaEditCondutor] = useState([])

  const {
    atualizaCondutores,
    telefoneEdicaoCondutorValue,
    setTelefoneEdicaoCondutorValue,
    inputTelefoneEdicaoCondutorMask,
    cepEdicaoCondutorValue,
    setCepEdicaoCondutorValue,
    inputCepEdicaoCondutorMask,
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
    if (celularEditadoCondutor !== null) {
      setTelefoneEdicaoCondutorValue(celularEditadoCondutor)
    }
    if (cepEditadoCondutor !== '') {
      setCepEdicaoCondutorValue(cepEditadoCondutor)
    }
    if (municipio !== '') {
      setTextMunicipio(municipio)
    }
    if (municipioId !== 0) {
      setIdMunicipio(municipioId)
    }
    if (estadoEditadoCondutor !== '') {
      setUf(estadoEditadoCondutor)
    }
  }, [celularEditadoCondutor, cepEditadoCondutor, estadoEditadoCondutor, municipio, municipioId])

  const { register, handleSubmit } = useForm()

  function clearInputsControlados() {
    setTextMunicipio('')
    setUf('')
    setTelefoneEdicaoCondutorValue('')
    setCepEdicaoCondutorValue('')
  }

  const formAtualizaCondutor = () => {
    const dadosAtualizaCondutor = {
      id,
      codigoCondutor,
      nome: nomeEditadoCondutor.trim(),
      cnh: cnhEditadoCondutor.trim(),
      categoriaCNH,
      endereco: enderecoEditadoCondutor.length > 0 ? enderecoEditadoCondutor.trim() : null,
      numeroEndereco: numeroEnderecoEditadoCondutor.length > 0 ? numeroEnderecoEditadoCondutor.trim() : null,
      complemento: complementoEditadoCondutor.length > 0 ? complementoEditadoCondutor.trim() : null,
      cep: cepEditadoCondutor.length > 0 ? cepEditadoCondutor.trim() : cepEdicaoCondutorValue.trim(),
      bairro: bairroEditadoCondutor.trim(),
      estado: estadoEditadoCondutor.length > 0 ? estadoEditadoCondutor : uf,
      municipioId: idMunicipio,
      email: emailEditadoCondutor.length > 0 ? emailEditadoCondutor.trim() : null,
      celular: telefoneEdicaoCondutorValue.length > 0 ? telefoneEdicaoCondutorValue.trim() : null
    }

    api
      .put('Condutor/atualizar-Condutor', dadosAtualizaCondutor)

      .then((response) => {
        if (response.status === 200) {
          setMessageSuccessEditCondutor(response.data.message)
          setSuccessEditCondutor(true)
          setModalSuccessEditCondutorShow(true)
          clearInputsControlados()
          atualizaCondutores()
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          if (error.response.data.message) {
            setMessageFalhaEditCondutor([error.response.data.message])
            setFalhaEditCondutor(true)
            setModalFalhaEditCondutorShow(true)
          } else {
            const mensagensErro = Object.values(error.response.data.errors)
            setMessageFalhaEditCondutor(mensagensErro.map((mensagens) => mensagens.toString()))
            setFalhaEditCondutor(true)
            setModalFalhaEditCondutorShow(true)
          }
        }
      })
  }

  return (
    <>
      {!successEditCondutor && !falhaEditCondutor && (
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
              <h4>Editar condutor</h4>
            </div>

            <div className="bodyModalEdit">
              <form className="formEdicaoAgente" onSubmit={handleSubmit(formAtualizaCondutor)}>
                <div className="editaCondutor">
                  <div className="labelForm col-3">
                    <input
                      type="text"
                      name="codigoCondutor"
                      placeholder="Código"
                      className="form-control"
                      id="codigoCondutor"
                      defaultValue={codigoCondutor}
                      readOnly
                      disabled
                    />
                    <label htmlFor="codigoCondutor">Código</label>
                  </div>

                  <div className="labelForm col-8">
                    <input
                      type="text"
                      name="nomeEdicaoCondutor"
                      placeholder="Nome"
                      className="form-control"
                      id="nomeEdicaoCondutor"
                      value={nomeEditadoCondutor}
                      onChange={(e) => setNomeEditadoCondutor(e.target.value)}
                      required
                    />
                    <label htmlFor="nomeEdicaoCondutor">Nome</label>
                  </div>

                  <div className="labelForm col-11 col-md-6">
                    <input
                      type="text"
                      name="cpfEdicaoCondutor"
                      placeholder="CPF/CNPJ"
                      className="form-control"
                      id="cpfEdicaoCondutor"
                      defaultValue={cpfEditadoCondutor}
                      readOnly
                      disabled
                    />
                    <label htmlFor="cpfEdicaoCondutor">CPF/CNPJ</label>
                  </div>

                  <div className="labelForm col-11 col-md-5">
                    <input
                      type="text"
                      name="cnhEdicaoCondutor"
                      placeholder="CNH"
                      className="form-control"
                      id="cnhEdicaoCondutor"
                      defaultValue={cnhEditadoCondutor}
                      readOnly
                      disabled
                    />
                    <label htmlFor="cnhEdicaoCondutor">CNH</label>
                  </div>

                  <div className="labelForm col-11 col-md-6">
                    <input
                      type="text"
                      name="emailEdicaoCondutor"
                      placeholder="E-mail"
                      className="form-control"
                      id="emailEdicaoCondutor"
                      value={emailEditadoCondutor}
                      onChange={(e) => setEmailEditadoCondutor(e.target.value)}
                    />
                    <label htmlFor="emailEdicaoCondutor">E-mail</label>
                  </div>

                  <div className="labelForm col-11 col-md-5">
                    <input
                      type="text"
                      name="celularEdicaoCondutor"
                      placeholder="Celular"
                      className="form-control"
                      id="celularEdicaoCondutor"
                      {...register('celularEdicaoCondutor')}
                      value={telefoneEdicaoCondutorValue}
                      onChange={inputTelefoneEdicaoCondutorMask}
                    />
                    <label htmlFor="celularEdicaoCondutor">Celular</label>
                  </div>

                  <div className="labelForm col-11 col-md-4">
                    <input
                      type="text"
                      name="enderecoEdicaoCondutor"
                      placeholder="Endereço"
                      className="form-control"
                      id="enderecoEdicaoCondutor"
                      value={cepEdicaoCondutorValue}
                      onChange={inputCepEdicaoCondutorMask}
                      required
                    />
                    <label htmlFor="enderecoEdicaoCondutor">CEP</label>
                  </div>

                  <div className="labelForm col-11 col-md-7">
                    <input
                      type="text"
                      name="enderecoEdicaoCondutor"
                      placeholder="Endereço"
                      className="form-control"
                      id="enderecoEdicaoCondutor"
                      value={enderecoEditadoCondutor}
                      onChange={(e) => setEnderecoEditadoCondutor(e.target.value)}
                      required
                    />
                    <label htmlFor="enderecoEdicaoCondutor">Endereço</label>
                  </div>

                  <div className="labelForm col-11 col-md-2">
                    <input
                      type="text"
                      name="numeroEnderecoEdicaoCondutor"
                      placeholder="Nº"
                      className="form-control"
                      id="numeroEnderecoEdicaoCondutor"
                      value={numeroEnderecoEditadoCondutor}
                      onChange={(e) => setNumeroEnderecoEditadoCondutor(e.target.value)}
                    />
                    <label htmlFor="numeroEnderecoEdicaoCondutor">Nº</label>
                  </div>

                  <div className="labelForm col-6">
                    <input
                      type="text"
                      className="municipios form-control"
                      name="municipioNovoCondutor"
                      id="municipioNovoCondutor"
                      placeholder="Município"
                      value={textMunicipio}
                      onChange={onChangeMunicipio}
                      required
                    />
                    <label htmlFor="municipioNovoCondutor"> Município </label>

                    {filterMunicipio.length > 0 && (
                      <div className="optionsMunicipios col-12">
                        {filterMunicipio.map((dado) => (
                          <div className="listaMunicipios" key={dado.id} onClick={() => selecionaMunicipio(dado)}>
                            {dado.nome}
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
                      name="estadoEnderecoNovoCondutor"
                      id="estadoEnderecoNovoCondutor"
                      placeholder="Estado"
                      {...register('estadoEnderecoNovoCondutor')}
                      value={uf}
                      readOnly
                      disabled
                    />
                    <label htmlFor="estadoEnderecoNovoCondutor">Estado</label>
                    {/* <Select
                      className="selectTipoInfracao col-12"
                      name="estadoNovoCondutor"
                      id="estadoNovoCondutor"
                      placeholder="Estado"
                      inputValue={uf}
                      // onChange={(e) => console.log(e)}
                    /> */}
                  </div>

                  <div className="labelForm col-11 col-md-5">
                    <input
                      type="text"
                      name="complementoEdicaoCondutor"
                      placeholder="Complemento"
                      className="form-control"
                      id="complementoEdicaoCondutor"
                      value={complementoEditadoCondutor}
                      onChange={(e) => setComplementoEditadoCondutor(e.target.value)}
                    />
                    <label htmlFor="complementoEdicaoCondutor">Complemento</label>
                  </div>

                  <div className="labelForm col-11 col-md-6">
                    <input
                      type="text"
                      name="bairroEdicaoCondutor"
                      placeholder="Bairro"
                      className="form-control"
                      id="bairroEdicaoCondutor"
                      value={bairroEditadoCondutor}
                      onChange={(e) => setBairroEditadoCondutor(e.target.value)}
                      required
                    />
                    <label htmlFor="bairroEdicaoCondutor">Bairro</label>
                  </div>

                  <div className="buttonsModalEdit mt-3">
                    {/* <ButtonSubmit text={'Salvar'} onClick={handleSubmit(formAtualizaCondutor)}></ButtonSubmit> */}
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

      {successEditCondutor && (
        <ModalMessage
          title={[messageSuccessEditCondutor]}
          className="modalSuccess"
          show={modalSuccessEditCondutorShow}
          onHide={() => [setModalSuccessEditCondutorShow(false), onClick()]}
          textbutton="OK"
        />
      )}

      {falhaEditCondutor && (
        <ModalMessage
          title={messageFalhaEditCondutor}
          className="modalFalha"
          show={modalFalhaEditCondutorShow}
          onHide={() => [setModalFalhaEditCondutorShow(false), onClick()]}
          textbutton="OK"
        />
      )}
    </>
  )
}

export default ModalEdicaoCondutor
