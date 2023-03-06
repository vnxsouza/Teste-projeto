import './ConfiguracoesProprietarios.css'
import { yupResolver } from '@hookform/resolvers/yup'
import Tooltip from '@mui/material/Tooltip'
import { ErrorForm } from 'components/FormTalao/ErrorForm'
import ModalEdicaoProprietario from 'components/ModalEdicaoProprietario'
import React, { useContext, useEffect, useState /* , useRef */ } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import Table from 'react-bootstrap/Table'
import { useForm } from 'react-hook-form'
import { BiArrowBack } from 'react-icons/bi'
import { BsSearch, BsFillPersonPlusFill } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'
import Select from 'react-select'
import * as yup from 'yup'

import ButtonSubmit from '../../components/ButtonSubmit'
// import ModalInativacaoProprietario from '../../components/ModalInativaProprietario'
import ModalMessage from '../../components/ModalMessage'
// import ModalReativacaoProprietario from '../../components/ModalReativaProprietario'
import SideBar from '../../components/SideBarLateral'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'
import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'

function ConfiguracoesProprietarios() {
  const { classSideNav } = useContext(CondicionaisFormContext)
  const {
    Proprietarios,
    atualizaProprietarios,
    cpfNovoProprietarioValue,
    inputCpfNovoProprietarioMask,
    cepNovoProprietarioValue,
    telefoneNovoProprietarioValue,
    inputCepNovoProprietarioMask,
    inputTelefoneNovoProprietarioMask,
    setCpfNovoProprietarioValue,
    setCepNovoProprietarioValue,
    setTelefoneNovoProprietarioValue,
    // getEstados,
    // OptionsEstados,
    textMunicipio,
    setTextMunicipio,
    onChangeMunicipio,
    filterMunicipio,
    selecionaMunicipio,
    idMunicipio,
    uf
  } = useContext(DadosContext)

  const [cadastraProprietario, setCadastraProprietario] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [tabelaProprietarios, setTabelaProprietarios] = useState(true)

  function ativaCadastroProprietario() {
    setCadastraProprietario(true)
    setTabelaProprietarios(false)
    setSearchActive(false)
  }

  function ativaPesquisa() {
    setSearchActive(!searchActive)
    setTabelaProprietarios(true)
    setCadastraProprietario(false)
  }

  const [successEditProprietario, setSuccessEditProprietario] = useState(false)
  const [modalSuccessEditProprietarioShow, setModalSuccessEditProprietarioShow] = useState(false)
  const [messageSuccessEditProprietario, setMessageSuccessEditProprietario] = useState('')
  const [falhaEditProprietario, setFalhaEditProprietario] = useState(false)
  const [modalFalhaEditProprietarioShow, setModalFalhaEditProprietarioShow] = useState(false)
  const [messageFalhaEditProprietario, setMessageFalhaEditProprietario] = useState([])

  function submitCadastroProprietario() {
    setSuccessEditProprietario(true)
    setModalSuccessEditProprietarioShow(true)
    setTextMunicipio('')
    atualizaProprietarios()
  }

  const validaCriacaoProprietario = yup.object({
    nomeNovoProprietario: yup.string().required(),
    cpfNovoProprietario: yup.string().required(),
    enderecoNovoProprietario: yup.string().required(),
    municipioNovoProprietario: yup.string().required(),
    cepNovoProprietario: yup.string().required(),
    bairroNovoProprietario: yup.string().required()
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validaCriacaoProprietario)
  })

  const formCriaProprietario = (data) => {
    const dadosProprietario = {
      nome: data.nomeNovoProprietario.trim(),
      cpF_CNPJ: data.cpfNovoProprietario.trim(),
      endereco: data.enderecoNovoProprietario.trim(),
      numeroEndereco:
        data.numeroEnderecoNovoProprietario.length > 0 ? data.numeroEnderecoNovoProprietario.trim() : null,
      complemento:
        data.complementoEnderecoNovoProprietario.length > 0 ? data.complementoEnderecoNovoProprietario.trim() : null,
      cep: data.cepNovoProprietario.trim(),
      bairro: data.bairroNovoProprietario.trim(),
      estado: uf,
      municipioId: idMunicipio,
      email: data.emailNovoProprietario.length > 0 ? data.emailNovoProprietario.trim() : null,
      celular: data.celularNovoProprietario.length > 0 ? data.celularNovoProprietario.trim() : null
    }

    api
      .post('Proprietario/cadastrar-proprietario', dadosProprietario)

      .then((response) => {
        if (response.status === 200) {
          setMessageSuccessEditProprietario(response.data.message)
          submitCadastroProprietario()
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

  const [nomeProprietario, setNomeProprietario] = useState('')

  const [searchProprietario, setSearchProprietario] = useState('')
  const [filterSearchProprietario, setFilterSearchProprietario] = useState([])
  const [filterAtivas, setFilterAtivas] = useState([])
  const [filterInativas, setFilterInativas] = useState([])

  useEffect(() => {
    setFilterSearchProprietario(Proprietarios)
  }, [Proprietarios])

  const [filterGeralProprietario, setFilterGeralProprietario] = useState('Todos')

  useEffect(() => {
    if (filterGeralProprietario === 'Todos') {
      const FiltroGeral = Proprietarios
      setFilterSearchProprietario(FiltroGeral)
    } else if (filterGeralProprietario === 'Atuais') {
      const FiltroGeral = Proprietarios.filter((value) => value.proprietarioAtual)
      setFilterAtivas(FiltroGeral)
      setFilterSearchProprietario(FiltroGeral)
    } else if (filterGeralProprietario === 'Não atuais') {
      const FiltroGeral = Proprietarios.filter((value) => !value.proprietarioAtual)
      setFilterInativas(FiltroGeral)
      setFilterSearchProprietario(FiltroGeral)
    }
  }, [filterGeralProprietario, Proprietarios])

  const onChangeBuscaProprietario = (e) => {
    e.preventDefault()
    setSearchProprietario(e.target.value)

    if (filterGeralProprietario === 'Todos') {
      const Filtro = Proprietarios.filter((value) => value.nome.toLowerCase().includes(e.target.value.toLowerCase()))

      setFilterSearchProprietario(Filtro)
    } else if (filterGeralProprietario === 'Atuais') {
      const Filtro = filterAtivas.filter((value) => value.nome.toLowerCase().includes(e.target.value.toLowerCase()))

      setFilterSearchProprietario(Filtro)
    } else if (filterGeralProprietario === 'Não atuais') {
      const Filtro = filterInativas.filter((value) => value.nome.toLowerCase().includes(e.target.value.toLowerCase()))

      setFilterSearchProprietario(Filtro)
    }
  }

  useEffect(() => {
    if (searchProprietario.length > 0) {
      ativaPesquisa()
    }
    // eslint-disable-next-line
  }, [searchProprietario])

  const [linhasPerPage, setLinhasPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(0)

  const pages = Math.ceil(filterSearchProprietario.length / linhasPerPage - 1)
  const startIndex = currentPage * linhasPerPage
  const endIndex = startIndex + linhasPerPage
  const currentProprietarios = filterSearchProprietario.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(0)
  }, [linhasPerPage])

  const [showIcon, setShowIcon] = useState({})

  const mostraIcon = (valor) => () => {
    setShowIcon((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const [showModalEdit, setShowModalEdit] = useState({})

  const mostraEdicao = (valor) => () => {
    setShowModalEdit((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  return (
    <div className="content">
      <div className="sideNavLateral">
        <SideBar />
      </div>

      <div className={`${classSideNav === 'sidenav' ? 'conteudoComSidenav' : 'conteudoSemSidenav'}`}>
        <div className="container mt-3">
          <h2>Configurações de Proprietários</h2>
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
                      name="buscaProprietario"
                      placeholder="Pesquisar proprietário"
                      className="formFiltroProprietario form-control"
                      id="buscaProprietario"
                      value={searchProprietario}
                      onChange={onChangeBuscaProprietario}
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
                {tabelaProprietarios ? (
                  <Tooltip title="Adicionar proprietário" placement="bottom" arrow>
                    <div>
                      <BsFillPersonPlusFill size={25} onClick={ativaCadastroProprietario} className="iconNavegacao" />
                    </div>
                  </Tooltip>
                ) : (
                  <Tooltip title="Voltar a consulta" placement="bottom" arrow>
                    <div>
                      <BiArrowBack
                        size={25}
                        onClick={() => [setTabelaProprietarios(true), setCadastraProprietario(false)]}
                        className="iconNavegacao"
                      />
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          {tabelaProprietarios && (
            <div className="tabelaAgentes container" id="tabelaProprietarios">
              <Table striped bordered>
                <thead>
                  <tr>
                    <th className="headerTabela">Nome</th>

                    <th className="headerTabela">CPF/CNPJ</th>

                    <th className="headerTabela">Endereço</th>

                    <th className="headerTabela">E-mail</th>

                    <th className="headerTabela">Celular</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProprietarios.map((dado, valor) => {
                    const anoData = dado.dataInativo?.slice(0, 4)
                    const mesData = dado.dataInativo?.slice(5, 7)
                    const diaData = dado.dataInativo?.slice(8, 10)

                    const data = `${diaData}/${mesData}/${anoData}`
                    const dataFinal = data === 'undefined/undefined/undefined' ? null : data

                    return (
                      <tr
                        className="linhaAgentes"
                        key={dado.id}
                        onMouseEnter={mostraIcon(valor)}
                        onMouseLeave={mostraIcon(valor)}
                      >
                        <td className="dadoTabela">
                          <span>{dado.nome}</span>
                        </td>
                        <td className="dadoTabela">
                          <span>{dado.cpF_CNPJ}</span>
                        </td>
                        <td className="dadoTabela">
                          <span>{dado.endereco}</span>
                        </td>
                        <td className="dadoTabela">
                          <span>{dado.email || ''}</span>
                        </td>
                        <td className="dadoTabela">
                          <span id="telefoneProprietario">{dado.celular || ''}</span>

                          {showIcon[valor] && (
                            <div className="iconsModificacao">
                              <Tooltip title="Editar" placement="top" arrow>
                                <div>
                                  <FaRegEdit size={30} className="iconEdit" onClick={mostraEdicao(valor)} />
                                </div>
                              </Tooltip>
                            </div>
                          )}
                        </td>

                        {showModalEdit[valor] && (
                          <td className="modalEdit">
                            <ModalEdicaoProprietario
                              show={!!showModalEdit}
                              onHide={() => [setShowModalEdit(false), setShowIcon(false)]}
                              onClick={() => [setShowModalEdit(false), setShowIcon(false)]}
                              textbutton="Salvar"
                              textbutton2="Cancelar"
                              codigoProprietario={10}
                              nome={dado.nome}
                              cpf={dado.cpF_CNPJ}
                              id={dado.id}
                              municipio={dado.municipio.nome || ''}
                              municipioId={dado.municipioId || 0}
                              cnh={dado.cnh || ''}
                              categoriaCNH={dado.categoriaCNH || ''}
                              endereco={dado.endereco || ''}
                              numeroEndereco={dado.numeroEndereco || ''}
                              complemento={dado.complemento || ''}
                              cep={dado.cep || ''}
                              bairro={dado.bairro || ''}
                              estado={dado.municipio.uf || ''}
                              email={dado.email || ''}
                              celular={dado.celular || ''}
                            />
                          </td>
                        )}
                      </tr>
                    )
                  })}
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
          )}

          {cadastraProprietario && (
            <div className="cadastro novoUsuario">
              <form className="criaUsuario mb-4" onSubmit={handleSubmit(formCriaProprietario)} autoComplete="false">
                <div className="subtitulo mb-2">
                  <h6 className="mt-1">Cadastrar novo proprietário</h6>
                </div>

                <div className="formCriaUsuario">
                  <div className="labelForm col-5">
                    <input
                      type="text"
                      className="form-control"
                      name="nomeNovoProprietario"
                      id="nomeNovoProprietario"
                      placeholder="Nome"
                      {...register('nomeNovoProprietario')}
                    />
                    <label htmlFor="nomeNovoProprietario">Nome</label>
                    {errors?.nomeNovoProprietario?.type && <ErrorForm />}
                  </div>

                  <div className="labelForm col-3">
                    <input
                      type="text"
                      className="form-control"
                      name="cpfNovoProprietario"
                      id="cpfNovoProprietario"
                      placeholder="CPF/CNPJ"
                      {...register('cpfNovoProprietario')}
                      value={cpfNovoProprietarioValue}
                      onChange={inputCpfNovoProprietarioMask}
                    />
                    <label htmlFor="cpfNovoProprietario">CPF/CNPJ</label>
                    {errors?.cpfNovoProprietario?.type && cpfNovoProprietarioValue.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-3">
                    <input
                      type="text"
                      className="form-control"
                      name="cepNovoProprietario"
                      id="cepNovoProprietario"
                      placeholder="CEP"
                      {...register('cepNovoProprietario')}
                      value={cepNovoProprietarioValue}
                      onChange={inputCepNovoProprietarioMask}
                    />
                    <label htmlFor="cepNovoProprietario">CEP</label>
                    {errors?.cepNovoProprietario?.type && cepNovoProprietarioValue.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-8">
                    <input
                      type="text"
                      className="form-control"
                      name="enderecoNovoProprietario"
                      id="enderecoNovoProprietario"
                      placeholder="Endereço"
                      {...register('enderecoNovoProprietario')}
                    />
                    <label htmlFor="enderecoNovoProprietario">Endereço</label>
                    {errors?.enderecoNovoProprietario?.type && <ErrorForm />}
                  </div>

                  <div className="labelForm col-3">
                    <input
                      type="text"
                      className="form-control"
                      name="numeroEnderecoNovoProprietario"
                      id="numeroEnderecoNovoProprietario"
                      placeholder="N°"
                      {...register('numeroEnderecoNovoProprietario')}
                    />
                    <label htmlFor="numeroEnderecoNovoProprietario">N°</label>
                  </div>

                  <div className="labelForm col-4">
                    <input
                      type="text"
                      className="form-control"
                      name="complementoEnderecoNovoProprietario"
                      id="complementoEnderecoNovoProprietario"
                      placeholder="Complemento"
                      {...register('complementoEnderecoNovoProprietario')}
                    />
                    <label htmlFor="complementoEnderecoNovoProprietario">Complemento</label>
                  </div>

                  <div className="labelForm col-5">
                    <input
                      type="text"
                      className="municipios form-control"
                      name="municipioNovoProprietario"
                      id="municipioNovoProprietario"
                      placeholder="Município"
                      {...register('municipioNovoProprietario')}
                      value={textMunicipio}
                      onChange={onChangeMunicipio}
                    />
                    <label htmlFor="municipioNovoProprietario"> Município </label>

                    {filterMunicipio.length > 0 && (
                      <div className="optionsMunicipios col-12">
                        {filterMunicipio.map((dado) => (
                          <div className="listaMunicipios" key={dado.id} onClick={() => selecionaMunicipio(dado)}>
                            {dado.nome}
                          </div>
                        ))}
                      </div>
                    )}

                    {errors?.municipioNovoProprietario?.type && textMunicipio.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-2">
                    <input
                      type="text"
                      className="form-control"
                      name="estadoNovoProprietario"
                      id="estadoNovoProprietario"
                      placeholder="Estado"
                      {...register('estadoNovoProprietario')}
                      value={uf}
                      readOnly
                      disabled
                    />
                    <label htmlFor="estadoNovoProprietario">Estado</label>
                  </div>

                  <div className="labelForm col-4">
                    <input
                      type="text"
                      className="form-control"
                      name="bairroNovoProprietario"
                      id="bairroNovoProprietario"
                      placeholder="Bairro"
                      {...register('bairroNovoProprietario')}
                    />
                    <label htmlFor="bairroNovoProprietario">Bairro</label>
                    {errors?.bairroNovoProprietario?.type && <ErrorForm />}
                  </div>

                  <div className="labelForm col-4">
                    <input
                      type="text"
                      className="form-control"
                      name="emailNovoProprietario"
                      id="emailNovoProprietario"
                      placeholder="E-Mail"
                      {...register('emailNovoProprietario')}
                    />
                    <label htmlFor="emailNovoProprietario">E-Mail</label>
                  </div>

                  <div className="labelForm col-3">
                    <input
                      type="text"
                      className="form-control"
                      name="celularNovoProprietario"
                      id="celularNovoProprietario"
                      placeholder="Nome"
                      {...register('celularNovoProprietario')}
                      value={telefoneNovoProprietarioValue}
                      onChange={inputTelefoneNovoProprietarioMask}
                    />
                    <label htmlFor="celularNovoProprietario">Celular</label>
                  </div>

                  <div className="buttonCriaUsuario col-12">
                    <ButtonSubmit type="submit" onClick={handleSubmit(formCriaProprietario)} text="Cadastrar" />
                  </div>

                  {successEditProprietario && (
                    <ModalMessage
                      title={[messageSuccessEditProprietario]}
                      className="modalSuccess"
                      show={modalSuccessEditProprietarioShow}
                      onHide={() => [
                        setSuccessEditProprietario(false),
                        reset(),
                        setCpfNovoProprietarioValue(''),
                        setCepNovoProprietarioValue(''),
                        setTelefoneNovoProprietarioValue('')
                      ]}
                      textbutton="Voltar ao registro de proprietário"
                      textbutton2="Ir para o ínicio"
                    />
                  )}

                  {falhaEditProprietario && (
                    <ModalMessage
                      title={messageFalhaEditProprietario}
                      className="modalFalha"
                      show={modalFalhaEditProprietarioShow}
                      onHide={() => setFalhaEditProprietario(false)}
                      textbutton="Tentar novamente"
                      textbutton2="Ir para o ínicio"
                    />
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConfiguracoesProprietarios
