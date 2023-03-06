import './ConfiguracoesCondutores.css'
import { yupResolver } from '@hookform/resolvers/yup'
import Tooltip from '@mui/material/Tooltip'
import { ErrorForm } from 'components/FormTalao/ErrorForm'
import ModalEdicaoCondutor from 'components/ModalEdicaoCondutor'
import ModalReativacaoCondutor from 'components/ModalReativaCondutor'
import React, { useContext, useEffect, useState /* , useRef */ } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import Table from 'react-bootstrap/Table'
import { useForm } from 'react-hook-form'
import { BiArrowBack } from 'react-icons/bi'
import { BsSearch, BsFillPersonPlusFill } from 'react-icons/bs'
import { FaRegEdit } from 'react-icons/fa'
import { MdPersonOff, MdPerson } from 'react-icons/md'
import Select from 'react-select'
import * as yup from 'yup'

import ButtonSubmit from '../../components/ButtonSubmit'
import ModalInativacaoCondutor from '../../components/ModalInativaCondutor'
import ModalMessage from '../../components/ModalMessage'
// import ModalReativacaoCondutor from '../../components/ModalReativaCondutor'
import SideBar from '../../components/SideBarLateral'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'
import { DadosContext } from '../../contexts/DadosContext'
import api from '../../services/api'

function ConfiguracoesCondutores() {
  const { classSideNav } = useContext(CondicionaisFormContext)

  const {
    Condutores,
    atualizaCondutores,
    cpfNovoCondutorValue,
    inputCpfNovoCondutorMask,
    cepNovoCondutorValue,
    inputCepNovoCondutorMask,
    telefoneNovoCondutorValue,
    inputTelefoneNovoCondutorMask,
    setCpfNovoCondutorValue,
    setCepNovoCondutorValue,
    setTelefoneNovoCondutorValue,
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

  // const optionsCategoriaCnh = [
  //   { value: 1, label: 'A' },
  //   { value: 2, label: 'B' },
  //   { value: 3, label: 'C' },
  //   { value: 4, label: 'D' },
  //   { value: 5, label: 'E' }
  // ]

  const [cadastraAgente, setCadastraAgente] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [tabelaAgentes, setTabelaAgentes] = useState(true)

  function ativaCadastroAgente() {
    setCadastraAgente(true)
    setTabelaAgentes(false)
    setSearchActive(false)
  }

  function ativaPesquisa() {
    setSearchActive(!searchActive)
    setTabelaAgentes(true)
    setCadastraAgente(false)
  }

  const [successCadastroCondutor, setSuccessCadastroCondutor] = useState(false)
  const [messageSuccessCadastroCondutor, setMessageSuccessCadastroCondutor] = useState('')
  const [falhaCadastroCondutor, setFalhaCadastroCondutor] = useState(false)
  const [messageFalhaCadastroCondutor, setMessageFalhaCadastroCondutor] = useState([])

  const validaCriacaoCondutor = yup.object({
    nomeNovoCondutor: yup.string().required(),
    cpfNovoCondutor: yup.string().required(),
    cnhNovoCondutor: yup.string().required(),
    categoriaCnhNovoCondutor: yup.number().required(),
    enderecoNovoCondutor: yup.string().required(),
    municipioNovoCondutor: yup.string().required(),
    cepNovoCondutor: yup.string().required(),
    bairroNovoCondutor: yup.string().required(),
    codigoNovoCondutor: yup.string().required()
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validaCriacaoCondutor)
  })

  // const [textCategoriaCnh, setTextCategoriaCnh] = useState([])

  const formCriaCondutor = (data) => {
    const categoriaCnh =
      data.categoriaCnhNovoCondutor === 1
        ? 'A'
        : data.categoriaCnhNovoCondutor === 2
        ? 'B'
        : data.categoriaCnhNovoCondutor === 3
        ? 'C'
        : data.categoriaCnhNovoCondutor === 4
        ? 'D'
        : data.categoriaCnhNovoCondutor === 5
        ? 'E'
        : null

    const dadosCondutor = {
      nome: data.nomeNovoCondutor.trim(),
      cnh: data.cnhNovoCondutor.trim(),
      cpF_CNPJ: data.cpfNovoCondutor.trim(),
      categoriaCNH: categoriaCnh,
      endereco: data.enderecoNovoCondutor.trim(),
      numeroEndereco: data.numeroEnderecoNovoCondutor.length > 0 ? data.numeroEnderecoNovoCondutor : null,
      complemento: data.complementoEnderecoNovoCondutor.length > 0 ? data.complementoEnderecoNovoCondutor : null,
      cep: data.cepNovoCondutor.trim(),
      bairro: data.bairroNovoCondutor.trim(),
      estado: uf,
      municipioId: idMunicipio,
      email: data.emailNovoCondutor.length > 0 ? data.emailNovoCondutor.trim() : null,
      celular: data.celularNovoCondutor.length > 0 ? data.celularNovoCondutor.trim() : null,
      codigo: data.codigoNovoCondutor.trim()
    }

    api
      .post('Condutor/cadastrar-condutor', dadosCondutor)

      .then((response) => {
        if (response.status === 200) {
          setMessageSuccessCadastroCondutor(response.data.message)
          setSuccessCadastroCondutor(true)
          atualizaCondutores()
          setTextMunicipio('')
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 500) {
          if (error.response.data.message) {
            setMessageFalhaCadastroCondutor([error.response.data.message])
            setFalhaCadastroCondutor(true)
          } else {
            const mensagensErro = Object.values(error.response.data.errors)
            setMessageFalhaCadastroCondutor(mensagensErro.map((mensagens) => mensagens.toString()))
            setFalhaCadastroCondutor(true)
          }
        }
      })
  }

  const [searchCondutor, setSearchCondutor] = useState('')
  const [filterSearchCondutor, setFilterSearchCondutor] = useState([])
  const [filterAtivas, setFilterAtivas] = useState([])
  const [filterInativas, setFilterInativas] = useState([])

  useEffect(() => {
    setFilterSearchCondutor(Condutores)
  }, [Condutores])

  const [filterGeralCondutor, setFilterGeralCondutor] = useState('Todos')

  useEffect(() => {
    if (filterGeralCondutor === 'Todos') {
      const FiltroGeral = Condutores
      setFilterSearchCondutor(FiltroGeral)
    } else if (filterGeralCondutor === 'Ativos') {
      const FiltroGeral = Condutores.filter((value) => !value.dataInativo)
      setFilterAtivas(FiltroGeral)
      setFilterSearchCondutor(FiltroGeral)
    } else if (filterGeralCondutor === 'Inativos') {
      const FiltroGeral = Condutores.filter((value) => value.dataInativo)
      setFilterInativas(FiltroGeral)
      setFilterSearchCondutor(FiltroGeral)
    }
  }, [filterGeralCondutor, Condutores])

  const onChangeBuscaCondutor = (e) => {
    e.preventDefault()
    setSearchCondutor(e.target.value)

    if (filterGeralCondutor === 'Todos') {
      const Filtro = Condutores.filter(
        (value) =>
          value.nome.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.cpf?.toString().includes(e.target.value)
      )

      setFilterSearchCondutor(Filtro)
    } else if (filterGeralCondutor === 'Ativos') {
      const Filtro = filterAtivas.filter(
        (value) =>
          value.nome.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.cpf?.toString().includes(e.target.value)
      )

      setFilterSearchCondutor(Filtro)
    } else if (filterGeralCondutor === 'Inativos') {
      const Filtro = filterInativas.filter(
        (value) =>
          value.nome.toLowerCase().includes(e.target.value.toLowerCase()) ||
          value.cpf?.toString().includes(e.target.value)
      )

      setFilterSearchCondutor(Filtro)
    }
  }

  useEffect(() => {
    if (searchCondutor.length > 0) {
      ativaPesquisa()
    }
    // eslint-disable-next-line
  }, [searchCondutor])

  const [linhasPerPage, setLinhasPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(0)

  const pages = Math.ceil(filterSearchCondutor.length / linhasPerPage - 1)
  const startIndex = currentPage * linhasPerPage
  const endIndex = startIndex + linhasPerPage
  const currentCondutores = filterSearchCondutor.slice(startIndex, endIndex)

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

  const [showModalInvalid, setShowModalInvalid] = useState({})
  const [showModalReative, setShowModalReative] = useState({})

  const [showModalEdit, setShowModalEdit] = useState({})

  const mostraEdicao = (valor) => () => {
    setShowModalEdit((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const mostraInativacao = (valor: number) => () => {
    setShowModalInvalid((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const mostraReativacao = (valor) => () => {
    setShowModalReative((state) => ({
      ...state,
      [valor]: !state[valor]
    }))
  }

  const [messageDataInativo, setMessageDataInativo] = useState({})

  const ativaMessageDataInativo = (valor) => () => {
    setMessageDataInativo((state) => ({
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
          <h2>Configurações de Condutores</h2>
          <div className="menuNavegacao mb-2">
            <div className="iconsMenu">
              <div className="pesquisaTabela">
                <form>
                  <div className="labelFiltroAgente">
                    {/* <div className="iconBusca">
                      <Tooltip title="Pesquisar" placement="bottom" arrow>
                        <div>
                          <BsSearch
                            size={25}
                            // onClick={ativaPesquisa}
                            color="white"
                          />
                        </div>
                      </Tooltip>
                    </div> */}
                    <select defaultValue={filterGeralCondutor} onChange={(e) => setFilterGeralCondutor(e.target.value)}>
                      <option>Todos</option>
                      <option>Ativos</option>
                      <option>Inativos</option>
                    </select>

                    <input
                      type="text"
                      name="buscaAgente"
                      placeholder="Nome, CPF ou código do condutor"
                      className="formFiltroAgente form-control"
                      id="buscaAgente"
                      value={searchCondutor}
                      onChange={onChangeBuscaCondutor}
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
                {tabelaAgentes ? (
                  <Tooltip title="Adicionar condutor" placement="bottom" arrow>
                    <div>
                      <BsFillPersonPlusFill size={25} onClick={ativaCadastroAgente} className="iconNavegacao" />
                    </div>
                  </Tooltip>
                ) : (
                  <Tooltip title="Voltar a consulta" placement="bottom" arrow>
                    <div>
                      <BiArrowBack
                        size={25}
                        onClick={() => [setTabelaAgentes(true), setCadastraAgente(false)]}
                        className="iconNavegacao"
                      />
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          {tabelaAgentes && (
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
                  </tr>
                </thead>
                <tbody>
                  {currentCondutores.map((dado, valor) => {
                    const anoData = dado.dataInativo?.slice(0, 4)
                    const mesData = dado.dataInativo?.slice(5, 7)
                    const diaData = dado.dataInativo?.slice(8, 10)

                    const data = `${diaData}/${mesData}/${anoData}`
                    const dataFinal = data === 'undefined/undefined/undefined' ? null : data

                    return (
                      <tr
                        className="linhaAgentes"
                        key={dado.id}
                        onMouseEnter={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                        onMouseLeave={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                        // onClick={dataFinal === null ? mostraIcon(valor) : ativaMessageDataInativo(valor)}
                      >
                        <td className="dadoTabela">
                          <span className={dado.dataInativo !== null ? 'textNomeAgenteInativo' : 'dadoTabela'}>
                            {dado.codigo}
                          </span>
                        </td>
                        <td className="dadoTabela">
                          <span className={dado.dataInativo !== null ? 'textNomeAgenteInativo' : 'dadoTabela'}>
                            {dado.nome}
                          </span>
                        </td>
                        <td className="dadoTabela">
                          <span className={dado.dataInativo !== null ? 'textNomeAgenteInativo' : 'dadoTabela'}>
                            {dado.cpF_CNPJ}
                          </span>
                        </td>
                        <td className="dadoTabela">
                          <span className={dado.dataInativo !== null ? 'textNomeAgenteInativo' : 'dadoTabela'}>
                            {dado.endereco}
                          </span>
                        </td>
                        <td className="dadoTabela">
                          <span className={dado.dataInativo !== null ? 'textNomeAgenteInativo' : 'dadoTabela'}>
                            {dado.email}
                          </span>
                        </td>
                        <td className="dadoTabela">
                          <span className={dado.dataInativo !== null ? 'textNomeAgenteInativo' : 'dadoTabela'}>
                            {dado.celular}
                          </span>

                          {showIcon[valor] && dado.dataInativo === null && (
                            <div className="iconsModificacao">
                              <Tooltip title="Editar" placement="top" arrow>
                                <div>
                                  <FaRegEdit size={30} className="iconEdit" onClick={mostraEdicao(valor)} />
                                </div>
                              </Tooltip>

                              <Tooltip title="Inativar" placement="top" arrow>
                                <div>
                                  <MdPersonOff size={32} className="iconInative" onClick={mostraInativacao(valor)} />
                                </div>
                              </Tooltip>
                            </div>
                          )}

                          {messageDataInativo[valor] && (
                            <div className="reativaAgente">
                              <span className="messageInativo">Inativado em: {dataFinal}</span>
                              <Tooltip title="Reativar" placement="top" arrow>
                                <div>
                                  <MdPerson size={32} className="iconReativar" onClick={mostraReativacao(valor)} />
                                </div>
                              </Tooltip>
                            </div>
                          )}
                        </td>

                        {showModalEdit[valor] && (
                          <td className="modalEdit">
                            <ModalEdicaoCondutor
                              show={!!showModalEdit}
                              onHide={() => [setShowModalEdit(false), setShowIcon(false)]}
                              onClick={() => [setShowModalEdit(false), setShowIcon(false)]}
                              textbutton="Salvar"
                              textbutton2="Cancelar"
                              codigoCondutor={dado.codigo}
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

                        {showModalInvalid[valor] && (
                          <td className="modalInvalid">
                            <ModalInativacaoCondutor
                              show={!!showModalInvalid}
                              onHide={() => [setShowModalInvalid(false), setShowIcon(false)]}
                              onClick={() => [setShowModalInvalid(false), setShowIcon(false)]}
                              textbutton="inativar"
                              textbutton2="Cancelar"
                              nome={dado.nome}
                              id={dado.id}
                            />
                          </td>
                        )}

                        {showModalReative[valor] && (
                          <td className="modalInvalid">
                            <ModalReativacaoCondutor
                              show={!!showModalReative}
                              onHide={() => [setShowModalReative(false), setShowIcon(false)]}
                              onClick={() => [setShowModalReative(false), setShowIcon(false)]}
                              textbutton="reativar"
                              textbutton2="Cancelar"
                              nome={dado.nome}
                              id={dado.id}
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

          {cadastraAgente && (
            <div className="cadastro novoUsuario">
              <form className="criaUsuario mb-4" onSubmit={handleSubmit(formCriaCondutor)} autoComplete="off">
                <div className="subtitulo mb-2">
                  <h6 className="mt-1">Cadastrar novo condutor</h6>
                </div>

                <div className="formCriaUsuario">
                  <div className="labelForm col-5">
                    <input
                      type="text"
                      className="form-control"
                      name="nomeNovoCondutor"
                      id="nomeNovoCondutor"
                      placeholder="Nome"
                      {...register('nomeNovoCondutor')}
                    />
                    <label htmlFor="nomeNovoCondutor">Nome</label>
                    {errors?.nomeNovoCondutor?.type && <ErrorForm />}
                  </div>

                  <div className="labelForm col-3">
                    <input
                      type="text"
                      className="form-control"
                      name="codigoNovoCondutor"
                      id="codigoNovoCondutor"
                      placeholder="Código"
                      {...register('codigoNovoCondutor')}
                    />
                    <label htmlFor="codigoNovoCondutor">Código</label>
                    {errors?.codigoNovoCondutor?.type && <ErrorForm />}
                  </div>

                  <div className="labelForm col-3">
                    <input
                      type="text"
                      className="form-control"
                      name="cpfNovoCondutor"
                      id="cpfNovoCondutor"
                      placeholder="CPF/CNPJ"
                      {...register('cpfNovoCondutor')}
                      value={cpfNovoCondutorValue}
                      onChange={inputCpfNovoCondutorMask}
                    />
                    <label htmlFor="cpfNovoCondutor">CPF/CNPJ</label>
                    {errors?.cpfNovoCondutor?.type && cpfNovoCondutorValue.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-4">
                    <input
                      type="text"
                      className="form-control"
                      name="cnhNovoCondutor"
                      id="cnhNovoCondutor"
                      placeholder="CNH"
                      maxLength={9}
                      {...register('cnhNovoCondutor')}
                    />
                    <label htmlFor="cnhNovoCondutor">CNH</label>
                    {errors?.cnhNovoCondutor?.type && <ErrorForm />}
                  </div>

                  <div className="labelForm col-3">
                    {/* <Select
                      className="selectTipoInfracao col-12"
                      options={optionsCategoriaCnh}
                      name="categoriaCnhNovoCondutor"
                      id="categoriaCnhNovoCondutor"
                      placeholder="Categoria/CNH"
                      required
                      value={textCategoriaCnh}
                      onChange={(e) => (e !== null ? setTextCategoriaCnh(e) : setTextCategoriaCnh([]))}
                      isClearable
                    /> */}
                    <select
                      name="categoriaCnh"
                      className="col-12"
                      defaultValue="Categoria/CNH"
                      {...register('categoriaCnhNovoCondutor')}
                    >
                      <option disabled>Categoria/CNH</option>
                      <option value={1}> A </option>
                      <option value={2}> B </option>
                      <option value={3}> C </option>
                      <option value={4}> D </option>
                      <option value={5}> E </option>
                    </select>
                    {errors?.categoriaCnhNovoCondutor?.type && <ErrorForm />}
                  </div>

                  <div className="labelForm col-4">
                    <input
                      type="text"
                      className="form-control"
                      name="cepNovoCondutor"
                      id="cepNovoCondutor"
                      placeholder="CEP"
                      {...register('cepNovoCondutor')}
                      value={cepNovoCondutorValue}
                      onChange={inputCepNovoCondutorMask}
                    />
                    <label htmlFor="cepNovoCondutor">CEP</label>
                    {errors?.cepNovoCondutor?.type && cepNovoCondutorValue.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-8">
                    <input
                      type="text"
                      className="form-control"
                      name="enderecoNovoCondutor"
                      id="enderecoNovoCondutor"
                      placeholder="Endereço"
                      {...register('enderecoNovoCondutor')}
                    />
                    <label htmlFor="enderecoNovoCondutor">Endereço</label>
                    {errors?.enderecoNovoCondutor?.type && <ErrorForm />}
                  </div>

                  <div className="labelForm col-3">
                    <input
                      type="text"
                      className="form-control"
                      name="numeroEnderecoNovoCondutor"
                      id="numeroEnderecoNovoCondutor"
                      placeholder="N°"
                      {...register('numeroEnderecoNovoCondutor')}
                    />
                    <label htmlFor="numeroEnderecoNovoCondutor">N°</label>
                  </div>

                  <div className="labelForm col-5">
                    <input
                      type="text"
                      className="municipios form-control"
                      name="municipioNovoCondutor"
                      id="municipioNovoCondutor"
                      placeholder="Município"
                      {...register('municipioNovoCondutor')}
                      value={textMunicipio}
                      onChange={onChangeMunicipio}
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

                    {errors?.municipioNovoCondutor?.type && textMunicipio.length === 0 && <ErrorForm />}
                  </div>

                  <div className="labelForm col-2">
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
                  </div>

                  <div className="labelForm col-4">
                    <input
                      type="text"
                      className="form-control"
                      name="bairroNovoCondutor"
                      id="bairroNovoCondutor"
                      placeholder="Bairro"
                      {...register('bairroNovoCondutor')}
                    />
                    <label htmlFor="bairroNovoCondutor">Bairro</label>
                    {errors?.bairroNovoCondutor?.type && <ErrorForm />}
                  </div>

                  {/* <div className="labelForm col-4">
                    <input
                      type="text"
                      className="form-control"
                      name="municipioNovoCondutor"
                      id="municipioNovoCondutor"
                      placeholder="Município"
                      {...register('municipioNovoCondutor')}
                    />
                    <label htmlFor="municipioNovoCondutor">Município</label>
                  </div> */}

                  <div className="labelForm col-4">
                    <input
                      type="text"
                      className="form-control"
                      name="complementoEnderecoNovoCondutor"
                      id="complementoEnderecoNovoCondutor"
                      placeholder="Complemento"
                      {...register('complementoEnderecoNovoCondutor')}
                    />
                    <label htmlFor="complementoEnderecoNovoCondutor">Complemento</label>
                  </div>

                  <div className="labelForm col-4">
                    <input
                      type="text"
                      className="form-control"
                      name="emailNovoCondutor"
                      id="emailNovoCondutor"
                      placeholder="E-Mail"
                      {...register('emailNovoCondutor')}
                    />
                    <label htmlFor="emailNovoCondutor">E-Mail</label>
                  </div>

                  <div className="labelForm col-3">
                    <input
                      type="text"
                      className="form-control"
                      name="celularNovoCondutor"
                      id="celularNovoCondutor"
                      placeholder="Celular"
                      {...register('celularNovoCondutor')}
                      value={telefoneNovoCondutorValue}
                      onChange={inputTelefoneNovoCondutorMask}
                    />
                    <label htmlFor="celularNovoCondutor">Celular</label>
                  </div>

                  <div className="buttonCriaUsuario col-12">
                    <ButtonSubmit type="submit" onClick={handleSubmit(formCriaCondutor)} text="Cadastrar" />
                  </div>

                  <ModalMessage
                    title={[messageSuccessCadastroCondutor]}
                    className="modalSuccess"
                    show={successCadastroCondutor}
                    onHide={() => [
                      setSuccessCadastroCondutor(false),
                      reset(),
                      setCpfNovoCondutorValue(''),
                      setCepNovoCondutorValue(''),
                      setTelefoneNovoCondutorValue('')
                    ]}
                    textbutton="Voltar ao registro de condutor"
                    textbutton2="Ir para o ínicio"
                  />

                  <ModalMessage
                    title={messageFalhaCadastroCondutor}
                    className="modalFalha"
                    show={falhaCadastroCondutor}
                    onHide={() => setFalhaCadastroCondutor(false)}
                    textbutton="Tentar novamente"
                    textbutton2="Ir para o ínicio"
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConfiguracoesCondutores
