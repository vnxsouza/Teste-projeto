import './DigitacaoAuto.css'
import Tooltip from '@mui/material/Tooltip'
import React, { useContext, useEffect, useState } from 'react'
import { BiImageAdd } from 'react-icons/bi'
import { BsFillGearFill, BsFillQuestionSquareFill, BsFillCheckSquareFill } from 'react-icons/bs'
import { IoMdRemoveCircle } from 'react-icons/io'
import { VscTriangleDown, VscTriangleRight } from 'react-icons/vsc'
import Select from 'react-select'

import ButtonSubmit from '../../components/ButtonSubmit'
import { ErrorMessage } from '../../components/ErrorMessage'
import { ErrorForm } from '../../components/FormTalao/ErrorForm'
import ModalMedidasAdministrativas from '../../components/ModalMedidasAdministrativas'
import ModalMessage from '../../components/ModalMessage'
import SideBar from '../../components/SideBarLateral'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'
import { DadosContext } from '../../contexts/DadosContext'

export default function DigitacaoAuto() {
  const {
    ModalidadeServico,
    Sentidos,
    TiposImagem,
    optionsTipoInfracao,
    setSelectedOptionsInfracao,
    sendValuesOptionsInfracao,
    selectedOptionsInfracao,
    typeInput,
    showSelectLocal,
    rowsEnquadramento,
    Locais,
    register,
    handleSubmit,
    enviaForm,
    erroForm,
    errors,
    textMunicipio,
    onChangeMunicipio,
    filterMunicipio,
    selecionaMunicipio,
    uf,
    numeroEnquadramento,
    filterEnquadramento,
    idEnquadramento,
    onChangeEnquadramento,
    selecionaEnquadramento,
    onChangePlaca,
    Placa,
    getVeiculos,
    erroVeiculo,
    prefixoVeiculo,
    setPrefixoVeiculo,
    textMarcaModelo,
    textCor,
    filterCor,
    onChangeCor,
    selecionaCor,
    onChangeMarcaModelo,
    filterMarcaModelo,
    selecionaMarcaModelo,
    nomeProprietario,
    setNomeProprietario,
    dataInfracao,
    setDataInfracao,
    hora,
    setHora,
    errorLoad,
    modalShow,
    setModalShow,
    success,
    modalSuccessShow,
    setModalSuccessShow,
    cpfCondutorValue,
    inputCpfCondutorMask,
    cnhCondutorValue,
    inputCnhCondutorMask,
    cnhProprietarioValue,
    inputCnhProprietarioMask,
    cpfProprietarioValue,
    inputCpfProprietarioMask,
    enderecoProprietario,
    onChangeEnderecoProprietario,
    falha,
    modalFalhaShow,
    setModalFalhaShow,
    messageSuccess,
    messageFalha,
    reset,
    filterAgente,
    onChangeAgente,
    selecionaAgente,
    agenteInfrator,
    serviceValue,
    setServiceValue,
    modalMedidasAdministrativas,
    enquadramentoRequired,
    setModalMedidasAdministrativas,
    nomeCondutorAuto,
    onChangeNomeCondutorAuto,
    filterCondutorAuto,
    selecionaCondutor,
    idCondutorSelecionado,
    idVeiculo,
    cpfCondutorAuto,
    cnhCondutorAuto,
    categoriaCnhCondutorAuto,
    cepNovoCondutorValue,
    inputCepNovoCondutorMask,
    telefoneNovoCondutorValue,
    inputTelefoneNovoCondutorMask,
    setCpfNovoCondutorValue,
    setCepNovoCondutorValue,
    setTelefoneNovoCondutorValue
  } = useContext(DadosContext)

  const {
    srcImageDefault,
    trocaImagem,
    selectedImages,
    hideOption,
    hideOptionAndDelete,
    srcImages,
    mostraOpcaoSecundaria,
    uploadSecundarioActive,
    hideOptionSecundaria,
    mostraOpcao,
    onSelectFilePrincipal,
    onSelectFilesSecundarios,
    removeImage,
    srcSecondImages,
    ocultaDadosAuto,
    collapseDadosAutoActive,
    mostraDadosAuto,
    ocultaDadosVeiculo,
    collapseDadosVeiculoActive,
    mostraDadosVeiculo,
    ocultaDadosInfracao,
    collapseDadosInfracaoActive,
    mostraDadosInfracao,
    ocultaDadosAgente,
    collapseDadosAgenteActive,
    mostraDadosAgente,
    ocultaDadosCondutor,
    collapseDadosCondutorActive,
    mostraDadosCondutor,
    classSideNav,
    tipoImagemImageDefault,
    setTipoImagemImageDefault,
    setTipoImagemImagensSecundarias,
    insereTipoImagemImagensSecundarias,
    messageRequiredTipoImagem,
    setMessageRequiredTipoImagem,
    textTipoImagemDefault,
    setTextTipoImagemDefault
  } = useContext(CondicionaisFormContext)

  // const [masterPercentage, setMasterPercentage] = useState(0)

  // const [slavePercentage, setSlavePercentage] = useState(0)

  // const handleMasterScroll = (e) => {
  //   const image = e.target.parentNode.querySelector('.image')
  //   const master = e.target
  //   const height = master.scrollHeight - master.clientHeight
  //   const percentage = (master.scrollTop / height) * 100
  //   const slaveHeight = image /* ? */.scrollHeight - image /* ? */.clientHeight
  //   const newSlavePosition = Math.ceil((master.scrollTop / height) * slaveHeight)
  //   setMasterPercentage(percentage)
  //   image?.scroll({
  //     top: newSlavePosition
  //   })
  // }

  // const handleSlaveScroll = (e) => {
  //   const image = e.target
  //   const form = e.target.parentNode.querySelector('.form-talao')
  //   const height = image.scrollHeight - image.clientHeight
  //   const percentage = (image.scrollTop / height) * 100
  //   const masterHeight = form /* ? */.scrollHeight - form /* ? */.clientHeight
  //   const newMasterPosition = (image.scrollTop / height) * masterHeight
  //   setSlavePercentage(percentage)
  //   form?.scroll({
  //     top: newMasterPosition
  //   })
  // }

  const [optionTipoImagemPrincipal, setOptionTipoImagemPrincipal] = useState(false)

  const [optionTipoImagensSecundarias, setOptionTipoImagensSecundarias] = useState({})

  function ativaOptionTipoImagemPrincipal() {
    setOptionTipoImagemPrincipal(!optionTipoImagemPrincipal)
  }

  const ativaOptionTipoImagensSecundarias = (valor) => () => {
    setOptionTipoImagensSecundarias((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const [typeInputUpload, setTypeInputUpload] = useState('')

  useEffect(() => {
    if (tipoImagemImageDefault === 0) {
      setTypeInputUpload('text')
    } else {
      setMessageRequiredTipoImagem(false)
      setTypeInputUpload('file')
    }
  }, [tipoImagemImageDefault, setMessageRequiredTipoImagem])

  const [messageRequiredTipoImagensSecundarias, setMessageRequiredTipoImagensSecundarias] = useState(false)

  return (
    <div className="content">
      <div className="sideNavLateral">
        <SideBar />
      </div>

      <div className={`${classSideNav === 'sidenav' ? 'conteudoComSidenav' : 'conteudoSemSidenav'}`}>
        <div className="title mt-3">
          <h2>Digitação de Auto</h2>
        </div>

        <div className="tela container">
          {selectedImages && (
            <div className="mostraImagem" onLoad={hideOption}>
              {uploadSecundarioActive && srcSecondImages.length > 0 && (
                <div className="arrayImagensPreview">
                  <div className={srcImages.readImage === srcImageDefault ? 'previewImageDefault' : 'uploadSecundario'}>
                    <img
                      src={srcImages[0].readImage}
                      alt="previewImagemDefault"
                      onClick={() => trocaImagem(srcImages[0])}
                    />
                  </div>

                  {srcSecondImages.map((dado) => (
                    <div
                      key={dado.id.toFixed(2)}
                      className={dado.readImage === srcImageDefault ? 'previewImageDefault' : 'uploadSecundario'}
                    >
                      <img src={dado.readImage} alt="uploadSecondImage" onClick={() => trocaImagem(dado)} />

                      <Tooltip title="Remover imagem" arrow placement="top" className="removeSecondImage">
                        <div>
                          <IoMdRemoveCircle
                            onClick={() => removeImage(dado.id, dado.readImage.split(',')[1])}
                            color="rgba(253, 47, 47, 0.932)"
                            className="buttonDeleteSecondImage"
                            size="17px"
                          />
                        </div>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              )}

              <div className="image" /* onScroll={handleSlaveScroll} */>
                <div className="iconsDivImage">
                  {mostraOpcaoSecundaria && srcImages[0].readImage === srcImageDefault ? (
                    <div className="divTipoImagem">
                      <div className="camposTipoImagem">
                        <Tooltip
                          title="Selecionar tipo de imagem"
                          placement="top"
                          onClick={ativaOptionTipoImagemPrincipal}
                          arrow
                          className="selectTipoImagem mt-1"
                        >
                          <div>
                            <BsFillGearFill color="white" size={24} />
                          </div>
                        </Tooltip>

                        {optionTipoImagemPrincipal && (
                          <div className="optionsTipoImagem mt-1">
                            <div className="divSelecionaTipoImagem" onBlur={ativaOptionTipoImagemPrincipal}>
                              <select
                                className="col-12"
                                name="tipoImagem"
                                onChange={(e) => [
                                  setTipoImagemImageDefault(Number(e.target.value)),
                                  setTextTipoImagemDefault(e.target.value)
                                ]}
                                defaultValue={textTipoImagemDefault}
                              >
                                <option disabled>TIPO DE IMAGEM</option>
                                {TiposImagem.map((dado) => (
                                  <option key={dado.id} value={dado.id}>
                                    {dado.descricao}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>

                      {messageRequiredTipoImagem && (
                        <span className="messageTipoImagem">O tipo de imagem é obrigatório!</span>
                      )}
                    </div>
                  ) : (
                    srcSecondImages.map((dado, valor) =>
                      dado.readImage === srcImageDefault ? (
                        <div className="divTipoImagem" key={dado.id}>
                          <div className="camposTipoImagem">
                            <Tooltip
                              title="Selecionar tipo de imagem"
                              placement="top"
                              onClick={ativaOptionTipoImagensSecundarias(valor)}
                              arrow
                              className="selectTipoImagem mt-1"
                            >
                              <div>
                                <BsFillGearFill color="white" size={24} />
                              </div>
                            </Tooltip>

                            {optionTipoImagensSecundarias[valor] && (
                              <div
                                className="optionsTipoImagensSecundarias mt-1"
                                onBlur={ativaOptionTipoImagensSecundarias(valor)}
                              >
                                <div className="divSelecionaTipoImagensSecundarias">
                                  <select
                                    className="col-12"
                                    name={`${dado.id}`}
                                    {...register(`${dado.id}`)}
                                    onChange={(e) => insereTipoImagemImagensSecundarias(e, dado)}
                                    defaultValue="TIPO DE IMAGEM"
                                  >
                                    <option disabled>TIPO DE IMAGEM</option>
                                    {TiposImagem.map((tipoImagem) => (
                                      <option key={tipoImagem.id} value={tipoImagem.id}>
                                        {tipoImagem.descricao}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>

                          {messageRequiredTipoImagensSecundarias && (
                            <span className="messageTipoImagem">O tipo de imagem é obrigatório!</span>
                          )}
                        </div>
                      ) : null
                    )
                  )}

                  {mostraOpcaoSecundaria && srcSecondImages.length < 3 && (
                    <div className="opcaoImagemSecundaria mt-1">
                      <Tooltip
                        title="Adicionar nova imagem"
                        placement="bottom"
                        arrow
                        className=""
                        onClick={
                          typeInputUpload === 'text' || typeInputUpload === ''
                            ? () => [setMessageRequiredTipoImagem(true), setOptionTipoImagemPrincipal(true)]
                            : null
                        }
                      >
                        <div>
                          <label className="uparImagem" onChange={hideOptionSecundaria}>
                            <input
                              className="selecionaImagem"
                              type={typeInputUpload}
                              name="images"
                              onChange={onSelectFilesSecundarios}
                              accept="image/*"
                            />
                            <BiImageAdd size={28} color="white" />
                          </label>
                        </div>
                      </Tooltip>
                    </div>
                  )}
                </div>

                <div className="uploadPrincipal">
                  <img src={srcImageDefault} alt="upload" />
                  <Tooltip
                    title={`Remover ${srcSecondImages.length > 0 ? 'imagens' : 'imagem'}`}
                    arrow
                    placement="bottom"
                    className="buttonDeleteImage"
                  >
                    <div>
                      <IoMdRemoveCircle
                        onClick={() => hideOptionAndDelete(/* selectedImages */)}
                        color="black"
                        size="35px"
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          )}

          {mostraOpcao && srcImages.length === 0 && (
            <div className="opcaoImagem mt-3">
              <Tooltip title="Fazer upload de imagens do auto" placement="bottom" arrow className="tooltipTalao">
                <div>
                  <label className="uparImagem">
                    <input
                      className="selecionaImagem"
                      type="file"
                      name="images"
                      onChange={onSelectFilePrincipal}
                      accept="image/*"
                    />
                    <BiImageAdd size={35} color="white" />
                  </label>
                </div>
              </Tooltip>
            </div>
          )}

          <form
            className="form mt-3"
            onSubmit={handleSubmit(enviaForm, erroForm)}
            autoComplete="off"
            // onScroll={handleMasterScroll}
          >
            <div className="form-talao mb-4">
              <div className="topo-talao">
                <div className="labelForm col-11 col-md-4 mt-3">
                  <input
                    className="form-control"
                    type="text"
                    name="numeroAuto"
                    id="numeroAuto"
                    placeholder="N° do Auto"
                    maxLength={10}
                    {...register('numeroAuto')}
                  />
                  <label htmlFor="numeroAuto">N° da infração</label>
                </div>

                <div className="labelForm col-11 col-md-7">
                  <select
                    className="col-12"
                    name="servicoId"
                    defaultValue="MODALIDADE DE SERVIÇO"
                    {...register('servicoId')}
                    onChange={(e) => [setServiceValue(Number(e.target.value)), setSelectedOptionsInfracao([])]}
                  >
                    <option disabled> MODALIDADE DE SERVIÇO </option>
                    {ModalidadeServico.map((dado) => (
                      <option key={dado.id} value={Number(dado.id)}>
                        {dado.descricao}
                      </option>
                    ))}
                  </select>
                  {errors?.servicoId?.type && <ErrorForm />}
                </div>
              </div>

              <div className="labelForm col-11">
                <Select
                  className=" selectTipoInfracao col-12"
                  name="tipoInfracao"
                  id="tipoInfracao"
                  value={selectedOptionsInfracao}
                  placeholder="TIPO DE INFRAÇÃO"
                  options={optionsTipoInfracao}
                  onChange={(item) => setSelectedOptionsInfracao(item)}
                  onBlur={(dado) => sendValuesOptionsInfracao(dado)}
                  isMulti
                  required
                />
              </div>

              <div className="subtitulo mt-3 mb-3" onClick={ocultaDadosVeiculo}>
                <h6 className="col-11 mt-1">Dados do Veículo</h6>
                {collapseDadosVeiculoActive ? (
                  <VscTriangleRight color="#fff" className="buttonCollapse" />
                ) : (
                  <VscTriangleDown color="#fff" className="buttonCollapse" />
                )}
              </div>

              {mostraDadosVeiculo && (
                <div className="dadosVeiculo">
                  <div className="labelForm col-5 col-md-2">
                    <input
                      type="text"
                      name="placa"
                      id="placa"
                      className="form-control"
                      placeholder="Placa"
                      maxLength={7}
                      onChange={onChangePlaca}
                      required
                      onBlur={getVeiculos}
                      value={Placa}
                    />
                    <label htmlFor="placa"> Placa </label>
                    {errors?.placa?.type && Placa.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-6 col-md-3">
                    <input
                      type="text"
                      name="cor"
                      id="cor"
                      className="form-control"
                      placeholder="Cor"
                      readOnly={typeInput === 'ReadOnly'}
                      value={textCor}
                      onChange={onChangeCor}
                    />
                    <label htmlFor="cor"> Cor </label>

                    {filterCor.length > 0 && (
                      <div className="optionsMunicipios col-12">
                        {filterCor.map((dado) => (
                          <div className="listaMunicipios" key={dado.id} onClick={() => selecionaCor(dado)}>
                            {dado.descricao}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="labelForm col-6 col-md-4">
                    <input
                      type="text"
                      name="marcaModelo"
                      id="marcaModelo"
                      className="form-control"
                      placeholder="Marca/ Modelo"
                      value={textMarcaModelo}
                      onChange={onChangeMarcaModelo}
                      readOnly={typeInput === 'ReadOnly'}
                    />
                    <label htmlFor="marcaModelo"> Marca/ Modelo </label>

                    {filterMarcaModelo.length > 0 && (
                      <div className="optionsMunicipios col-12">
                        {filterMarcaModelo.map((dado) => (
                          <div className="listaMunicipios" key={dado.id} onClick={() => selecionaMarcaModelo(dado)}>
                            {dado.descricao}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="labelForm col-5 col-md-2">
                    <input
                      type="text"
                      name="prefixoVeiculo"
                      id="prefixoVeiculo"
                      className="form-control"
                      placeholder="Prefixo"
                      readOnly={typeInput === 'ReadOnly'}
                      value={prefixoVeiculo || ''}
                      onChange={(e) => setPrefixoVeiculo(e.target.value)}
                    />
                    <label htmlFor="prefixoVeiculo"> Prefixo </label>
                  </div>

                  {serviceValue === 50 && (
                    <>
                      <div className="labelForm col-8 mb-3">
                        <input
                          type="text"
                          className="municipios form-control"
                          name="municipio"
                          id="municipio"
                          placeholder="Município"
                          {...register('municipio')}
                          value={textMunicipio}
                          onChange={onChangeMunicipio}
                        />
                        <label htmlFor="municipio"> Município </label>

                        {filterMunicipio.length > 0 && (
                          <div className="optionsMunicipios col-12">
                            {filterMunicipio.map((dado) => (
                              <div className="listaMunicipios" key={dado.id} onClick={() => selecionaMunicipio(dado)}>
                                {dado.nome}
                              </div>
                            ))}
                          </div>
                        )}

                        {errors?.municipio?.type && textMunicipio.length === 0 && <ErrorForm />}
                      </div>

                      <div className="labelForm col-3">
                        <input
                          type="text"
                          className="form-control"
                          name="uf"
                          id="uf"
                          placeholder="UF"
                          readOnly
                          value={uf}
                          {...register('uf')}
                        />
                        <label htmlFor="uf">UF</label>
                        {errors?.uf?.type && <ErrorForm />}
                      </div>
                    </>
                  )}

                  {erroVeiculo && getVeiculos && <ErrorMessage className="errorMessageVeiculo" text={erroVeiculo} />}
                </div>
              )}

              {/* <div className="subtitulo mb-3" onClick={ocultaDadosAuto}>
                <h6 className="col-11 mt-1">Dados do Proprietário</h6>
                {collapseDadosAutoActive ? (
                  <VscTriangleRight color="#fff" className="buttonCollapse" />
                ) : (
                  <VscTriangleDown color="#fff" className="buttonCollapse" />
                )}
              </div>

              {mostraDadosAuto && (
                <div className="dadosProprietario">
                  <div className={`labelForm ${serviceValue === 50 ? 'col-7' : 'col-11'}`}>
                    <input
                      type="text"
                      name="nomeProprietario"
                      id="nomeProprietario"
                      readOnly={typeInput}
                      placeholder="Nome do proprietário"
                      className="form-control"
                      {...register('nomeProprietario')}
                      value={nomeProprietario}
                      onChange={(e) => setNomeProprietario(e.target.value)}
                    />
                    <label htmlFor="nomeProprietario">Nome</label>
                  </div>

                  {serviceValue === 50 && (
                    <>
                      <div className="labelForm col-4">
                        <input
                          type="text"
                          name="cnhProprietario"
                          id="cnhProprietario"
                          className="form-control"
                          placeholder="CNH"
                          {...register('cnhProprietario')}
                          value={cnhProprietarioValue}
                          onChange={inputCnhProprietarioMask}
                        />
                        <label htmlFor="cnhProprietario"> CNH </label>
                        {errors?.cnhProprietario?.type && cnhProprietarioValue.length === 0 && <ErrorForm />}
                      </div>

                      <div className="labelForm col-5">
                        <input
                          type="text"
                          name="cpfProprietario"
                          id="cpfProprietario"
                          className="form-control"
                          placeholder="CPF"
                          {...register('cpfProprietario')}
                          value={cpfProprietarioValue}
                          onChange={inputCpfProprietarioMask}
                        />
                        <label htmlFor="cpfProprietario"> CPF </label>
                        {errors?.cpfProprietario?.type && cpfProprietarioValue.length === 0 && <ErrorForm />}
                      </div>

                      <div className="labelForm col-6">
                        <input
                          type="text"
                          name="enderecoProprietario"
                          id="enderecoProprietario"
                          className="form-control"
                          placeholder="Endereco"
                          {...register('enderecoProprietario')}
                          value={enderecoProprietario}
                          onChange={onChangeEnderecoProprietario}
                        />
                        <label htmlFor="enderecoProprietario"> Endereço </label>
                      </div>
                    </>
                  )}
                </div>
              )} */}

              <div className="subtitulo mt-3 mb-3" onClick={ocultaDadosInfracao}>
                <h6 className="col-11 mt-1">Dados da Infração</h6>
                {collapseDadosInfracaoActive ? (
                  <VscTriangleRight color="#fff" className="buttonCollapse" />
                ) : (
                  <VscTriangleDown color="#fff" className="buttonCollapse" />
                )}
              </div>

              {mostraDadosInfracao && (
                <div className="dadosInfracao">
                  <label className="data col-6 col-md-4">
                    Data
                    <input
                      type="date"
                      name="dataInfracao"
                      id="data"
                      className="form-control"
                      onChange={(e) => setDataInfracao(e.target.value)}
                      value={dataInfracao}
                    />
                  </label>

                  <label className="data col-5 col-md-3">
                    {' '}
                    Horário
                    <input
                      type="time"
                      name="hora"
                      required
                      id="hora"
                      className="form-control"
                      {...register('hora')}
                      onChange={(e) => setHora(e.target.value)}
                      value={hora}
                    />
                  </label>

                  <div className="labelForm col-11 col-md-4">
                    <select name="sentido" className="col-12" defaultValue="SENTIDO" {...register('sentido')}>
                      <option disabled>SENTIDO</option>
                      {Sentidos.map((dado) => (
                        <option key={dado.id} value={Number(dado.id)}>
                          {dado.descricao}
                        </option>
                      ))}
                    </select>
                    {errors?.sentido?.type && <ErrorForm />}
                  </div>

                  {showSelectLocal && (
                    <div className="labelForm col-11 col-md-4">
                      <select name="local" className="col-12" defaultValue="LOCAL" {...register('local')}>
                        <option disabled>LOCAL</option>
                        {Locais.map((dado) => (
                          <option key={dado.id} value={dado.id}>
                            {dado.descricao}
                          </option>
                        ))}
                      </select>
                      {errors?.local?.type && <ErrorForm />}
                    </div>
                  )}

                  <div className={`labelForm ${showSelectLocal ? 'col-9 col-md-5' : 'col-9'}`}>
                    <input
                      type="text"
                      name="endereco"
                      id="endereco"
                      className="form-control"
                      placeholder="Endereço"
                      {...register('endereco')}
                    />
                    <label htmlFor="endereco"> Endereço </label>
                    {errors?.endereco?.type && <ErrorForm />}
                  </div>

                  <div className="labelForm col-2">
                    <input
                      type="text"
                      name="numeroEndereco"
                      id="numeroEndereco"
                      className="form-control"
                      placeholder="N°"
                      {...register('numeroEndereco')}
                    />
                    <label htmlFor="numeroEndereco"> N° </label>
                    {errors?.numeroEndereco?.type && <ErrorForm />}
                  </div>

                  <div className="labelForm col-11">
                    <textarea
                      type="text"
                      rows={rowsEnquadramento}
                      name="enquadramentoId"
                      placeholder="Código de enquadramento"
                      className="form-control"
                      id="enquadramento"
                      {...register('enquadramentoId')}
                      value={numeroEnquadramento}
                      onChange={onChangeEnquadramento}
                      required={enquadramentoRequired}
                    />
                    <label htmlFor="enquadramento">Código de enquadramento</label>

                    {filterEnquadramento.length > 0 && (
                      <div className="optionsEnquadramento col-12">
                        {filterEnquadramento.map((dado) => (
                          <li
                            className="listaEnquadramento"
                            key={dado.id}
                            onClick={() => selecionaEnquadramento(dado)}
                            value={idEnquadramento}
                          >
                            {dado.codigo} - {dado.grupo} - {dado.descricao}
                          </li>
                        ))}
                      </div>
                    )}
                    {errors?.enquadramentoId?.type && numeroEnquadramento.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-11">
                    <textarea
                      type="text"
                      name="observacao"
                      id="observacao"
                      placeholder="Observação"
                      className="form-control"
                      rows="1"
                      {...register('observacao')}
                    />
                    <label htmlFor="observacao"> Observação </label>
                  </div>
                </div>
              )}

              <div className="subtitulo mt-3 mb-3" onClick={ocultaDadosCondutor}>
                <h6 className="col-11 mt-1">Dados do condutor</h6>
                {collapseDadosCondutorActive ? (
                  <VscTriangleRight color="#fff" className="buttonCollapse" />
                ) : (
                  <VscTriangleDown color="#fff" className="buttonCollapse" />
                )}
              </div>

              {mostraDadosCondutor && (
                <div className="dadosCondutor">
                  <div className="labelForm col-6">
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        name="nomeCondutor"
                        id="nomeCondutor"
                        placeholder="Nome do condutor"
                        {...register('nomeCondutor')}
                        value={nomeCondutorAuto}
                        onChange={onChangeNomeCondutorAuto}
                        disabled={idVeiculo === 0 && serviceValue !== 50}
                      />
                      <label htmlFor="nomeCondutor"> Nome </label>

                      {filterCondutorAuto.length > 0 && idCondutorSelecionado !== null && (
                        <div className="optionsMunicipios col-12">
                          {filterCondutorAuto.map((dado) => (
                            <div className="listaMunicipios" key={dado.id} onClick={(e) => selecionaCondutor(dado)}>
                              {dado.codigo} - {dado.nome}
                            </div>
                          ))}
                        </div>
                      )}
                      {errors?.nomeCondutor?.type && nomeCondutorAuto.length === 0 && <ErrorForm />}
                    </div>
                    <div>
                      {idCondutorSelecionado !== null ? (
                        <Tooltip
                          title={
                            idVeiculo !== 0
                              ? 'Condutor não identificado'
                              : 'Digite os dados do veículo para selecionar o condutor'
                          }
                          arrow
                          placement="bottom"
                          className={
                            idVeiculo !== 0 && serviceValue !== 50
                              ? 'iconCondutorNaoIdentificado'
                              : 'iconVeiculoNaoSelecionado'
                          }
                        >
                          <div>
                            <BsFillQuestionSquareFill
                              onClick={() => (idVeiculo !== 0 && serviceValue !== 50 ? selecionaCondutor(null) : null)}
                              size={18}
                            />
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title="Condutor identificado"
                          arrow
                          placement="bottom"
                          className="iconCondutorNaoIdentificado"
                        >
                          <div>
                            <BsFillCheckSquareFill onClick={() => selecionaCondutor(0)} size={18} />
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  <div className="labelForm col-5">
                    <input
                      type="text"
                      name="cpfCondutor"
                      id="cpfCondutor"
                      className="form-control"
                      placeholder="CPF/CNPJ"
                      {...register('cpfCondutor')}
                      value={cpfCondutorAuto.length > 0 ? cpfCondutorAuto : cpfCondutorValue}
                      disabled={
                        (cpfCondutorAuto.length >= 0 &&
                          idCondutorSelecionado !== 0 &&
                          idCondutorSelecionado !== null &&
                          serviceValue !== 50) ||
                        (idVeiculo === 0 && serviceValue !== 50)
                      }
                      onChange={inputCpfCondutorMask}
                    />
                    <label htmlFor="cpfCondutor"> CPF/CNPJ </label>
                    {errors?.cpfCondutor?.type && cpfCondutorValue.length === 0 && cpfCondutorAuto.length === 0 && (
                      <ErrorForm />
                    )}
                  </div>

                  <div className="labelForm col-11 col-md-4">
                    {idCondutorSelecionado === null ? (
                      <select
                        name="categoriaCNH"
                        className="col-12"
                        defaultValue={
                          categoriaCnhCondutorAuto === '1' || categoriaCnhCondutorAuto === 'A'
                            ? 1
                            : categoriaCnhCondutorAuto === '2' || categoriaCnhCondutorAuto === 'B'
                            ? 2
                            : 'CATEGORIA CNH'
                        }
                        {...register('categoriaCNH')}
                      >
                        <option disabled>CATEGORIA CNH</option>
                        <option value={1}>A</option>
                        <option value={2}>B</option>
                        <option value={3}>C</option>
                        <option value={4}>D</option>
                        <option value={5}>E</option>
                      </select>
                    ) : (
                      <>
                        <input
                          type="text"
                          name="categoriaCnhCondutor"
                          id="categoriaCnhCondutor"
                          className="form-control"
                          placeholder="Categoria CNH"
                          {...register('categoriaCnhCondutor')}
                          value={categoriaCnhCondutorAuto}
                          disabled={
                            (categoriaCnhCondutorAuto.length > 0 &&
                              idCondutorSelecionado !== 0 &&
                              serviceValue !== 50) ||
                            (idVeiculo === 0 && serviceValue !== 50)
                          }
                          onChange={inputCnhCondutorMask}
                        />
                        <label htmlFor="categoriaCnhCondutor"> Categoria CNH </label>
                      </>
                    )}
                    {errors?.categoriaCNH?.type && !categoriaCnhCondutorAuto && <ErrorForm />}
                  </div>

                  <div className="labelForm col-11 col-md-7">
                    <input
                      type="text"
                      name="cnhCondutor"
                      id="cnhCondutor"
                      className="form-control"
                      placeholder="CNH do Condutor"
                      {...register('cnhCondutor')}
                      value={cnhCondutorAuto.length > 0 ? cnhCondutorAuto : cnhCondutorValue}
                      disabled={
                        (cnhCondutorAuto.length > 0 && idCondutorSelecionado !== 0 && serviceValue !== 50) ||
                        (idVeiculo === 0 && serviceValue !== 50)
                      }
                      onChange={inputCnhCondutorMask}
                    />
                    <label htmlFor="cnhCondutor"> CNH </label>
                    {errors?.cnhCondutor?.type && cnhCondutorValue.length === 0 && cnhCondutorAuto.length === 0 && (
                      <ErrorForm />
                    )}
                  </div>

                  {idCondutorSelecionado === null && (
                    <>
                      <div className="labelForm col-11 col-md-4">
                        <input
                          type="text"
                          name="cepCondutor"
                          id="cepCondutor"
                          className="form-control"
                          placeholder="CEP"
                          {...register('cepNovoCondutor')}
                          value={cepNovoCondutorValue}
                          onChange={inputCepNovoCondutorMask}
                        />
                        <label htmlFor="cepCondutor"> CEP </label>
                        {/* {errors?.cnhCondutor?.type && cnhCondutorValue.length === 0 && cnhCondutorAuto.length === 0 && (
                          <ErrorForm />
                        )} */}
                      </div>

                      <div className="labelForm col-11 col-md-7">
                        <input
                          type="text"
                          name="enderecoCondutor"
                          id="enderecoCondutor"
                          className="form-control"
                          placeholder="Endereço"
                          {...register('enderecoCondutor')}
                        />
                        <label htmlFor="enderecoCondutor"> Endereço </label>
                        {/* {errors?.cnhCondutor?.type && cnhCondutorValue.length === 0 && cnhCondutorAuto.length === 0 && (
                          <ErrorForm />
                        )} */}
                      </div>

                      <div className="labelForm col-11 col-md-2">
                        <input
                          type="text"
                          name="numeroEnderecoCondutor"
                          id="numeroEnderecoCondutor"
                          className="form-control"
                          placeholder="N°"
                          {...register('numeroEnderecoCondutor')}
                        />
                        <label htmlFor="numeroEnderecoCondutor"> N° </label>
                        {/* {errors?.cnhCondutor?.type && cnhCondutorValue.length === 0 && cnhCondutorAuto.length === 0 && (
                          <ErrorForm />
                        )} */}
                      </div>

                      <div className="labelForm col-7 mb-3">
                        <input
                          type="text"
                          className="municipios form-control"
                          name="municipio"
                          id="municipio"
                          placeholder="Município"
                          {...register('municipio')}
                          value={textMunicipio}
                          onChange={onChangeMunicipio}
                        />
                        <label htmlFor="municipio"> Município </label>

                        {filterMunicipio.length > 0 && (
                          <div className="optionsMunicipios col-12">
                            {filterMunicipio.map((dado) => (
                              <div className="listaMunicipios" key={dado.id} onClick={() => selecionaMunicipio(dado)}>
                                {dado.nome}
                              </div>
                            ))}
                          </div>
                        )}

                        {errors?.municipio?.type && textMunicipio.length === 0 && <ErrorForm />}
                      </div>

                      <div className="labelForm col-2">
                        <input
                          type="text"
                          className="form-control"
                          name="estadoCondutor"
                          id="estadoCondutor"
                          placeholder="UF"
                          readOnly
                          value={uf}
                          {...register('estadoCondutor')}
                        />
                        <label htmlFor="estadoCondutor">UF</label>
                        {errors?.uf?.type && <ErrorForm />}
                      </div>

                      <div className="labelForm col-11 col-md-6">
                        <input
                          type="text"
                          name="bairroCondutor"
                          id="bairroCondutor"
                          className="form-control"
                          placeholder="Bairro"
                          {...register('bairroCondutor')}
                        />
                        <label htmlFor="bairroCondutor"> Bairro </label>
                        {/* {errors?.cnhCondutor?.type && cnhCondutorValue.length === 0 && cnhCondutorAuto.length === 0 && (
                          <ErrorForm />
                        )} */}
                      </div>

                      <div className="labelForm col-11 col-md-5">
                        <input
                          type="text"
                          name="complementoCondutor"
                          id="complementoCondutor"
                          className="form-control"
                          placeholder="Complemento"
                          {...register('complementoCondutor')}
                        />
                        <label htmlFor="complementoCondutor"> Complemento </label>
                        {/* {errors?.cnhCondutor?.type && cnhCondutorValue.length === 0 && cnhCondutorAuto.length === 0 && (
                          <ErrorForm />
                        )} */}
                      </div>

                      <div className="labelForm col-11 col-md-6">
                        <input
                          type="text"
                          name="emailCondutor"
                          id="emailCondutor"
                          className="form-control"
                          placeholder="E-mail"
                          {...register('emailCondutor')}
                        />
                        <label htmlFor="emailCondutor"> E-mail </label>
                        {/* {errors?.cnhCondutor?.type && cnhCondutorValue.length === 0 && cnhCondutorAuto.length === 0 && (
                          <ErrorForm />
                        )} */}
                      </div>

                      <div className="labelForm col-11 col-md-5">
                        <input
                          type="text"
                          name="celularCondutor"
                          id="celularCondutor"
                          className="form-control"
                          placeholder="Celular"
                          {...register('celularNovoCondutor')}
                          value={telefoneNovoCondutorValue}
                          onChange={inputTelefoneNovoCondutorMask}
                        />
                        <label htmlFor="celularCondutor"> Celular </label>
                        {/* {errors?.cnhCondutor?.type && cnhCondutorValue.length === 0 && cnhCondutorAuto.length === 0 && (
                          <ErrorForm />
                        )} */}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="subtitulo mb-3 mt-3" onClick={ocultaDadosAgente}>
                <h6 className="col-11 mt-1">Dados do agente</h6>
                {collapseDadosAgenteActive ? (
                  <VscTriangleRight color="#fff" className="buttonCollapse" />
                ) : (
                  <VscTriangleDown color="#fff" className="buttonCollapse" />
                )}
              </div>

              {mostraDadosAgente && (
                <div className="dadosAgente mb-3">
                  <div className="labelForm col-11">
                    <input
                      type="text"
                      name="codigoAgente"
                      placeholder="Código do agente"
                      className="form-control"
                      id="codigoAgente"
                      {...register('agenteInfrator')}
                      value={agenteInfrator}
                      onChange={onChangeAgente}
                    />
                    <label htmlFor="codigoAgente">Código</label>

                    {filterAgente.length > 0 && (
                      <div className="optionsAgente col-12">
                        {filterAgente.map((dado, valor) => (
                          <div className="listaAgentes" key={dado.id} onClick={() => selecionaAgente(dado)}>
                            {dado.id} - {dado.nome}
                          </div>
                        ))}
                      </div>
                    )}
                    {errors?.agenteInfrator?.type && agenteInfrator.length === 0 && <ErrorForm />}
                  </div>
                </div>
              )}

              <div className="teste">
                <ButtonSubmit type="submit" text="Inserir" />
              </div>

              {modalMedidasAdministrativas && (
                <ModalMedidasAdministrativas
                  show={modalMedidasAdministrativas}
                  onHide={() => setModalMedidasAdministrativas(false)}
                  textbutton="Confirmar"
                />
              )}

              {errorLoad && (
                <ModalMessage
                  title={['Erro na conexão com o servidor']}
                  className="modalFalha"
                  text="Houve um erro na conexão com o servidor. Por favor, tente novamente mais tarde."
                  textbutton="Fechar"
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
              )}

              {success && (
                <ModalMessage
                  title={[messageSuccess]}
                  className="modalSuccess"
                  show={modalSuccessShow}
                  onHide={() => [setModalSuccessShow(false), reset()]}
                  textbutton="Voltar ao registro de auto"
                />
              )}

              {falha && (
                <ModalMessage
                  title={[messageFalha]}
                  className="modalFalha"
                  show={modalFalhaShow}
                  onHide={() => [setModalFalhaShow(false)]}
                  textbutton="Tentar novamente"
                />
              )}
            </div>
          </form>
        </div>
        {/* <button className='buttonSubmit' onClick={ativaModalMedidasAdmin}> Inserir </button> */}
      </div>
    </div>
  )
}
