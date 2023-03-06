/* eslint-disable no-unused-expressions */
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { createContext, useState, useEffect, useContext, useMemo, useCallback, ReactNode } from 'react'
import { FieldErrorsImpl, FieldValues, useForm, UseFormReset } from 'react-hook-form'
import { scroller } from 'react-scroll'
import { mask, unMask } from 'remask'
import * as yup from 'yup'

import api from '../services/api'
import { AuthContext } from './AuthContext'
import { CondicionaisFormContext } from './CondicionaisFormContext'

interface OptionsTipoInfracaoProps {
  value: any
  label: any
}

interface DadosContextProps {
  TiposInfracao: any[]
  ModalidadeServico: any[]
  Enquadramento: any[]
  Sentidos: any[]
  Documentos: any[]
  TiposImagem: any[]
  feriadosNacionais: any[]
  feriadosMunicipais: any[]
  tiposRelatorio: any[]
  Veiculos: any[]
  Permissionarios: any[]
  Proprietarios: any[]
  proprietariosSelecionados: any[]
  condutoresSelecionados: any[]
  condutoresInativos: any[]
  Condutores: any[]
  // Estados: any[]
  // OptionsEstados: any[]
  cor: any[]
  marcaModelo: any[]
  selectedOptionsInfracao: any[]
  setSelectedOptionsInfracao: any
  setProprietariosSelecionados: any
  setCondutoresSelecionados: any
  setCondutoresInativos: any
  sendValuesOptionsInfracao: (dado: any) => void
  Locais: any[]
  register: any
  handleSubmit: any
  enviaForm: (data: any) => void
  erroForm: () => void
  errors: FieldErrorsImpl<{
    [x: string]: any
  }>
  onChangeMunicipio: (e: any) => void
  filterMunicipio: any[]
  selecionaMunicipio: (dado: any) => void
  filterEnquadramento: any[]
  onChangeEnquadramento: (e: any) => void
  selecionaEnquadramento: (dado: any) => void
  onChangePlaca: (e: any) => void
  setMarcaModelo: any
  setCor: any
  filterCor: any[]
  onChangeCor: (e: any) => void
  selecionaCor: (dado: any) => void
  filterCondutorAuto: any[]
  onChangeNomeCondutorAuto: (e: any) => void
  selecionaCondutor: (dado: any) => void
  onChangeMarcaModelo: (e: any) => void
  filterMarcaModelo: any[]
  inputCpfCondutorMask: (e: any) => void
  inputCnhProprietarioMask: (e: any) => void
  inputCpfProprietarioMask: (e: any) => void
  inputCpfNovoProprietarioMask: (e: any) => void
  inputCpfNovoCondutorMask: (e: any) => void
  inputCepNovoProprietarioMask: (e: any) => void
  inputCepNovoCondutorMask: (e: any) => void
  inputCepEdicaoProprietarioMask: (e: any) => void
  inputCepEdicaoCondutorMask: (e: any) => void
  inputTelefoneNovoProprietarioMask: (e: any) => void
  inputTelefoneNovoCondutorMask: (e: any) => void
  inputTelefoneEdicaoProprietarioMask: (e: any) => void
  inputTelefoneEdicaoCondutorMask: (e: any) => void
  onChangeEnderecoProprietario: (e: any) => void
  inputCpfAgenteMask: (e: any) => void
  inputCnhCondutorMask: (e: any) => void
  Agentes: any[]
  Corporacao: any[]
  infracoesRegistradas: any[]
  filterAgente: any[]
  onChangeAgente: (e: any) => void
  selecionaAgente: (dado: any) => void
  TiposUsuario: any[]
  lotesGerados: any[]
  Usuarios: any[]
  medidasAdministrativas: any[]
  selecionaMarcaModelo: (dado: any) => void

  nomeCondutorAuto: string
  cpfCondutorAuto: string
  cnhCondutorAuto: string
  categoriaCnhCondutorAuto: string
  typeInput: string
  textMunicipio: string
  uf: string
  Placa: string
  prefixoVeiculo: string
  descricaoEnquadramento: string
  erroVeiculo: string
  chassi: string
  numeroEnquadramento: string
  textMarcaModelo: string
  textCor: string
  dataInfracao: string
  nomeProprietario: string
  hora: string
  cpfCondutorValue: string
  cpfAgenteValue: string
  cnhCondutorValue: string
  cnhProprietarioValue: string
  cpfProprietarioValue: string
  cpfNovoProprietarioValue: string
  cpfNovoCondutorValue: string
  cepNovoProprietarioValue: string
  cepNovoCondutorValue: string
  cepEdicaoProprietarioValue: string
  cepEdicaoCondutorValue: string
  telefoneNovoProprietarioValue: string
  telefoneNovoCondutorValue: string
  telefoneEdicaoProprietarioValue: string
  telefoneEdicaoCondutorValue: string
  enderecoProprietario: string
  messageSuccess: string
  messageMedidasAdmin: string
  messageFalha: any[]
  agenteInfrator: string
  nomeUnidadeFinanceira: string
  valueTipoNotificacao: number
  rowsEnquadramento: number
  idMunicipio: number
  idEnquadramento: number
  serviceValue: number
  idInfracao: number
  diasDefesa: number
  diasVencimento: number
  diasJarit: number
  valorUnidadeFinanceira: number
  idProprietarioSelecionado: number
  idProprietarioAtual: number
  idCondutorSelecionado: number
  idVeiculoSelecionado: number
  idMarcaModelo: number
  idVeiculo: number
  errorLoad: boolean
  modalShow: boolean
  success: boolean
  modalSuccessShow: boolean
  modalFalhaShow: boolean
  falha: boolean
  modalMedidasAdministrativas: boolean
  enquadramentoRequired: boolean
  showSelectLocal: boolean
  ehAtualizacao: boolean
  optionsTipoInfracao: OptionsTipoInfracaoProps[]
  setTextMunicipio: React.Dispatch<React.SetStateAction<string>>
  setUf: React.Dispatch<React.SetStateAction<string>>
  setPlaca: React.Dispatch<React.SetStateAction<string>>
  getVeiculos: () => Promise<void>
  setPrefixoVeiculo: React.Dispatch<React.SetStateAction<string>>
  setChassi: React.Dispatch<React.SetStateAction<string>>
  setNomeProprietario: React.Dispatch<React.SetStateAction<string>>
  setDataInfracao: React.Dispatch<React.SetStateAction<string>>
  setHora: React.Dispatch<React.SetStateAction<string>>
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>
  setModalSuccessShow: React.Dispatch<React.SetStateAction<boolean>>
  reset: UseFormReset<FieldValues>
  setModalFalhaShow: React.Dispatch<React.SetStateAction<boolean>>
  setServiceValue: React.Dispatch<React.SetStateAction<number>>
  setIdProprietarioSelecionado: React.Dispatch<React.SetStateAction<number>>
  setIdProprietarioAtual: React.Dispatch<React.SetStateAction<number>>
  setIdCondutorSelecionado: React.Dispatch<React.SetStateAction<number>>
  setIdVeiculoSelecionado: React.Dispatch<React.SetStateAction<number>>
  setIdVeiculo: React.Dispatch<React.SetStateAction<number>>
  setIdMunicipio: React.Dispatch<React.SetStateAction<number>>
  setEhAtualizacao: React.Dispatch<React.SetStateAction<boolean>>
  setModalMedidasAdministrativas: React.Dispatch<React.SetStateAction<boolean>>
  setMessageSuccess: React.Dispatch<React.SetStateAction<string>>
  setMessageFalha: React.Dispatch<React.SetStateAction<any[]>>
  setFalha: React.Dispatch<React.SetStateAction<boolean>>
  setCpfAgenteValue: React.Dispatch<React.SetStateAction<string>>
  setValueTipoNotificacao: React.Dispatch<React.SetStateAction<number>>
  setCpfNovoProprietarioValue: React.Dispatch<React.SetStateAction<string>>
  setCpfNovoCondutorValue: React.Dispatch<React.SetStateAction<string>>
  setCepNovoProprietarioValue: React.Dispatch<React.SetStateAction<string>>
  setCepNovoCondutorValue: React.Dispatch<React.SetStateAction<string>>
  setCepEdicaoProprietarioValue: React.Dispatch<React.SetStateAction<string>>
  setCepEdicaoCondutorValue: React.Dispatch<React.SetStateAction<string>>
  setTelefoneNovoProprietarioValue: React.Dispatch<React.SetStateAction<string>>
  setTelefoneNovoCondutorValue: React.Dispatch<React.SetStateAction<string>>
  setTelefoneEdicaoProprietarioValue: React.Dispatch<React.SetStateAction<string>>
  setTelefoneEdicaoCondutorValue: React.Dispatch<React.SetStateAction<string>>
  setTextMarcaModelo: React.Dispatch<React.SetStateAction<string>>
  setIdMarcaModelo: React.Dispatch<React.SetStateAction<number>>
  atualizaAgentes: () => void
  submitForm: () => void
  atualizaInfracoes: () => void
  atualizaLotesGerados: () => void
  atualizaCorporacao: () => void
  atualizaUsuarios: () => void
  atualizaProprietarios: () => void
  atualizaCondutores: () => void
  atualizaPermissionarios: () => void
  // getEstados: () => void
}

interface DadosContextProviderProps {
  children: ReactNode
}

export const DadosContext = createContext({} as DadosContextProps)

export function DadosContextProvider({ children }: DadosContextProviderProps) {
  const { setSrcImages, selectedImages, setSelectedImages, hideOption, setMostraOpcao, arrayImagens } =
    useContext(CondicionaisFormContext)

  const { clienteCode } = useContext(AuthContext)

  const [TiposInfracao, setTiposInfracao] = useState([])
  const [ModalidadeServico, setModalidadeServico] = useState([])
  const [Sentidos, setSentidos] = useState([])
  const [Documentos, setDocumentos] = useState([])
  const [Locais, setLocais] = useState([])
  const [Municipio, setMunicipio] = useState([])
  const [Enquadramento, setEnquadramento] = useState([])
  const [Agentes, setAgentes] = useState([])
  const [Corporacao, setCorporacao] = useState([])
  const [TiposUsuario, setTiposUsuario] = useState([])
  const [TiposImagem, setTiposImagem] = useState([])
  const [infracoesRegistradas, setInfracoesRegistradas] = useState([])
  const [Usuarios, setUsuarios] = useState([])
  const [errorLoad, setErrorLoad] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [success, setSuccess] = useState(false)
  const [modalSuccessShow, setModalSuccessShow] = useState(false)
  const [falha, setFalha] = useState(false)
  const [modalFalhaShow, setModalFalhaShow] = useState(false)
  const [messageSuccess, setMessageSuccess] = useState('')
  const [messageFalha, setMessageFalha] = useState([])
  const [feriados, setFeriados] = useState([])
  const [feriadosNacionais, setFeriadosNacionais] = useState([])
  const [feriadosMunicipais, setFeriadosMunicipais] = useState([])
  const [tiposRelatorio, setTiposRelatorio] = useState([])
  const [Veiculos, setVeiculos] = useState([])
  const [Permissionarios, setPermissionarios] = useState([])
  const [Proprietarios, setProprietarios] = useState([])
  const [Condutores, setCondutores] = useState([])
  // const [Estados, setEstados] = useState([])
  // const [OptionsEstados, setOptionsEstados] = useState([])

  useEffect(() => {
    api
      .get('/Enum/TiposServicos')
      .then((response) => {
        setModalidadeServico(response.data.data)
      })
      .catch((error) => {
        setErrorLoad(true)
        setModalShow(true)
      })
  }, [])

  useEffect(() => {
    api
      .get('/Enum/Sentidos')
      .then((response) => {
        setSentidos(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  useEffect(() => {
    api
      .get('/Enum/Documentos')
      .then((response) => {
        setDocumentos(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  useEffect(() => {
    api
      .get('/Enum/Locais')
      .then((response) => {
        setLocais(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  useEffect(() => {
    api
      .get('Municipio')
      .then((response) => {
        setMunicipio(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  useEffect(() => {
    api
      .get('Agente')
      .then((response) => {
        setAgentes(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  function atualizaAgentes() {
    api
      .get('Agente')
      .then((response) => {
        setAgentes(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }

  useEffect(() => {
    api
      .get('Corporacao')
      .then((response) => {
        setCorporacao(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  function atualizaCorporacao() {
    api
      .get('Corporacao')
      .then((response) => {
        setCorporacao(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }

  useEffect(() => {
    api
      .get('/Enum/TiposUsuario')
      .then((response) => {
        setTiposUsuario(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  useEffect(() => {
    api
      .get('/Enum/TiposImagem')
      .then((response) => {
        setTiposImagem(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  const [valueTipoNotificacao, setValueTipoNotificacao] = useState(1)

  useEffect(() => {
    if (valueTipoNotificacao === 0) {
      api
        .get(`/Notificacao/get-infracoes`)
        .then((response) => {
          setInfracoesRegistradas(response.data.data)
        })
        .catch((error) => {
          console.log('error')
        })
    } else {
      api
        .get(`/Notificacao/get-infracoes?tipoNotificacao=${valueTipoNotificacao}`)
        .then((response) => {
          setInfracoesRegistradas(response.data.data)
        })
        .catch((error) => {
          console.log('error')
        })
    }
  }, [valueTipoNotificacao])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function atualizaInfracoes() {
    if (valueTipoNotificacao === 0) {
      api
        .get(`/Notificacao/get-infracoes`)
        .then((response) => {
          setInfracoesRegistradas(response.data.data)
        })
        .catch((error) => {
          console.log('error')
        })
    } else {
      api
        .get(`/Notificacao/get-infracoes?tipoNotificacao=${valueTipoNotificacao}`)
        .then((response) => {
          setInfracoesRegistradas(response.data.data)
        })
        .catch((error) => {
          console.log('error')
        })
    }
  }

  const [lotesGerados, setLotesGerados] = useState([])

  useEffect(() => {
    api
      .get('/Notificacao/lotes-gerados')
      .then((response) => {
        setLotesGerados(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  function atualizaLotesGerados() {
    api
      .get('/Notificacao/lotes-gerados')
      .then((response) => {
        setLotesGerados(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }

  const [serviceValue, setServiceValue] = useState(0)

  const [valorUnidadeFinanceira, setValorUnidadeFinanceira] = useState(0)
  const [nomeUnidadeFinanceira, setNomeUnidadeFinanceira] = useState('')

  useEffect(() => {
    serviceValue === 0
      ? api
          .get(`Enquadramento?clienteId=${clienteCode}`)
          .then((response) => {
            setEnquadramento(response.data.data.enquadramentos)
            setValorUnidadeFinanceira(response.data.data.configuracao.valorUnidadeFinanceira)
            setNomeUnidadeFinanceira(response.data.data.configuracao.nomeUnidadeFinanceira)
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error)
          })
      : api
          .get('Enquadramento/enquadramentos-servico', {
            params: {
              tipoServico: serviceValue,
              clienteId: clienteCode
            }
          })
          .then((response) => {
            setEnquadramento(response.data.data.enquadramentos)
          })
          .catch((error) => {
            console.log(error)
          })
  }, [serviceValue, clienteCode])

  useEffect(() => {
    serviceValue === 0
      ? api
          .get('/Enum/TiposInfracao')
          .then((response) => {
            setTiposInfracao(response.data.data)
          })
          .catch((error) => {
            console.log(error)
          })
      : api
          .get(`Infracao/tipo-infracao?tipoServico=${serviceValue}`)
          .then((response) => {
            setTiposInfracao(response.data.data)
          })
          .catch((error) => {
            console.log(error)
          })
  }, [serviceValue])

  useEffect(() => {
    api
      .get('Account/Usuarios')
      .then((response) => {
        setUsuarios(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  function atualizaUsuarios() {
    api
      .get('Account/Usuarios')
      .then((response) => {
        setUsuarios(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    api
      .get(`/Feriado/feriados-municipais?clienteId=${clienteCode}`)
      .then((response) => {
        setFeriadosMunicipais(response.data.data.map((feriado) => feriado.data.slice(0, 10)))
      })
      .catch((error) => {
        console.log(error)
      })
  }, [clienteCode])

  useEffect(() => {
    const anoAtual = new Date()
    api
      .get(`/Feriado/feriados-nacionais?ano=${anoAtual.getFullYear()}`)
      .then((response) => {
        if (`${response.data.data}`.length === 0) {
          const arrayFeriados = feriados

          const feriadosCadastrados = arrayFeriados.map((feriado) => [
            {
              data: feriado.date,
              nome: feriado.name
            }
          ])

          const feriadosFinais = feriadosCadastrados.map((datas) => ({ ...datas[0] }))

          if (feriados.length > 0) {
            api
              .post('Feriado', feriadosFinais)
              .then(() => {
                setFeriadosNacionais(feriadosFinais.map((dataFeriado) => dataFeriado.data.slice(0, 10)))
              })
              .catch((error) => {
                console.log(error)
              })
          }
        } else {
          setFeriadosNacionais(response.data.data.map((feriado) => feriado.data.slice(0, 10)))
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }, [feriados])

  useEffect(() => {
    const anoAtual = new Date()

    const apiFeriados = axios.create({
      baseURL: 'https://api.invertexto.com/v1'
    })

    api
      .get(`/Feriado/feriados-nacionais?ano=${anoAtual.getFullYear()}`)
      .then((response) => {
        if (`${response.data.data}`.length === 0) {
          apiFeriados
            .get('holidays/2023?token=2156|0qwbrCuvbM9AXiyb7vjnMNwRQrl9bwFy&state=SP')
            .then((responseFeriados) => {
              setFeriados(responseFeriados.data)
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
      .catch((error) => console.log(error))
  }, [])

  const [diasDefesa, setDiasDefesa] = useState(0)
  const [diasVencimento, setDiasVencimento] = useState(0)
  const [diasJarit, setDiasJarit] = useState(0)

  useEffect(() => {
    api
      .get(`/Cliente/get-configuracoes?clienteId=${clienteCode}`)
      .then((response) => {
        setDiasDefesa(response.data.data.diasDefesa)
        setDiasVencimento(response.data.data.diasVencimento)
        setDiasJarit(response.data.data.diasJARIT)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [clienteCode])

  useEffect(() => {
    api
      .get('Enum/TiposRelatorio')
      .then((response) => {
        setTiposRelatorio(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    api
      .get('Veiculo/veiculos-cadastrados')
      .then((response) => {
        setVeiculos(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    api
      .get('Permissionario')
      .then((response) => {
        setPermissionarios(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  function atualizaPermissionarios() {
    api
      .get('Permissionario')
      .then((response) => {
        setPermissionarios(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const [idVeiculoSelecionado, setIdVeiculoSelecionado] = useState(0)

  const [idProprietarioSelecionado, setIdProprietarioSelecionado] = useState(0)
  const [idProprietarioAtual, setIdProprietarioAtual] = useState(0)
  const [proprietariosSelecionados, setProprietariosSelecionados] = useState([])

  useEffect(() => {
    api
      .get('Proprietario')
      .then((response) => {
        setProprietarios(
          response.data.data.sort((a, b) => {
            if (a.id < b.id) return -1
            if (a.id > b.id) return 1
            return 0
          })
        )
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    if (proprietariosSelecionados.length > 1) {
      setProprietarios(
        Proprietarios.sort((a) => {
          if (a.id === idProprietarioAtual) return -1
          if (a.id !== idProprietarioAtual) return 1
          return 0
        })
      )
    }
  }, [proprietariosSelecionados, idProprietarioAtual, Proprietarios])

  function atualizaProprietarios() {
    api
      .get('Proprietario')
      .then((response) => {
        setProprietarios(
          response.data.data.sort((a, b) => {
            if (a.id < b.id) return -1
            if (a.id > b.id) return 1
            return 0
          })
        )
      })
      .catch((error) => {
        console.log('error')
      })
  }

  const [idCondutorSelecionado, setIdCondutorSelecionado] = useState(0)
  const [condutoresSelecionados, setCondutoresSelecionados] = useState([])
  const [condutoresInativos, setCondutoresInativos] = useState([])

  useEffect(() => {
    api
      .get('Condutor')
      .then((response) => {
        setCondutores(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  function atualizaCondutores() {
    api
      .get('Condutor')
      .then((response) => {
        setCondutores(response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const [ehAtualizacao, setEhAtualizacao] = useState(false)

  useEffect(() => {
    api
      .get(`Permissionario/pesquisa-veiculo?veiculoId=${idVeiculoSelecionado}`)
      .then((response) => {
        if (response.data.data !== null) {
          setEhAtualizacao(true)
          setIdProprietarioAtual(response.data.data.proprietarioAtualId)
          setProprietariosSelecionados(response.data.data.proprietariosId)
          setCondutoresSelecionados(response.data.data.condutoresId)
          setCondutoresInativos(response.data.data.condutoresInativosId)
        } else {
          setEhAtualizacao(false)
          setIdProprietarioAtual(0)
          setProprietariosSelecionados([])
          setCondutoresSelecionados([])
          setCondutoresInativos([])
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }, [idVeiculoSelecionado])

  useEffect(() => {
    if (proprietariosSelecionados.length === 1) {
      setIdProprietarioAtual(Number(proprietariosSelecionados))
    }
  }, [proprietariosSelecionados])

  const optionsTipoInfracao = TiposInfracao.map((dado) => ({ value: dado.id, label: dado.descricao }))

  const [selectedOptionsInfracao, setSelectedOptionsInfracao] = useState([])
  const [valuesOptionsInfracao, setValuesOptionsInfracao] = useState([])

  const sendValuesOptionsInfracao = useCallback(
    (dado) => {
      setValuesOptionsInfracao(
        selectedOptionsInfracao.map((value) => {
          if (dado.value !== value.value) {
            return value.value
          } else {
            return value.value
          }
        })
      )
    },
    [selectedOptionsInfracao]
  )

  const [textMunicipio, setTextMunicipio] = useState('')
  const [filterMunicipio, setFilterMunicipio] = useState([])
  const [idMunicipio, setIdMunicipio] = useState(0)
  const [uf, setUf] = useState('')

  const onChangeMunicipio = useCallback(
    (e) => {
      e.preventDefault()
      setTextMunicipio(e.target.value)

      const Filtro = Municipio.filter((value) => value.nome.toLowerCase().includes(e.target.value.toLowerCase()))

      setFilterMunicipio(Filtro)
    },
    [Municipio]
  )

  useEffect(() => {
    if (!textMunicipio) {
      setFilterMunicipio([])
      setIdMunicipio(0)
      setUf('')
    }
  }, [textMunicipio])

  function selecionaMunicipio(dado) {
    setTextMunicipio(dado.nome)
    setIdMunicipio(dado.id)
    setUf(dado.uf)
    setFilterMunicipio([])
  }

  const [numeroEnquadramento, setnumeroEnquadramento] = useState('')
  const [filterEnquadramento, setFilterEnquadramento] = useState([])
  const [idEnquadramento, setIdEnquadramento] = useState(0)
  const [descricaoEnquadramento, setDescricaoEnquadramento] = useState('')

  const onChangeEnquadramento = useCallback(
    (e) => {
      setnumeroEnquadramento(e.target.value)

      const FiltroEnquadramento = Enquadramento.filter(
        (value) =>
          value.codigo.toString().includes(e.target.value) ||
          value.descricao.toLowerCase().includes(e.target.value.toLowerCase())
      )

      setFilterEnquadramento(FiltroEnquadramento)
    },
    [Enquadramento]
  )

  useEffect(() => {
    if (!numeroEnquadramento) {
      setFilterEnquadramento([])
      setIdEnquadramento(0)
      setDescricaoEnquadramento('')
    }
  }, [numeroEnquadramento])

  function selecionaEnquadramento(dado) {
    setIdEnquadramento(dado.id)
    setnumeroEnquadramento(`${dado.codigo} - ${dado.grupo} - ${dado.descricao}`)
    setDescricaoEnquadramento(dado.descricao)
    setFilterEnquadramento([])
  }

  const [Placa, setPlaca] = useState('')

  const onChangePlaca = (e) => {
    e.preventDefault()
    setPlaca(e.target.value)
  }

  const [erroVeiculo, setErroVeiculo] = useState('')
  const [chassi, setChassi] = useState('')
  const [marcaModelo, setMarcaModelo] = useState([])
  const [cor, setCor] = useState([])
  const [nomeProprietario, setNomeProprietario] = useState('')
  const [enderecoProprietario, setEnderecoProprietario] = useState('')
  const [idVeiculo, setIdVeiculo] = useState(0)
  const [idProprietario, setIdProprietario] = useState(0)
  const [prefixoVeiculo, setPrefixoVeiculo] = useState('')

  function onChangeEnderecoProprietario(e) {
    e.preventDefault()
    setEnderecoProprietario(e.target.value)
  }

  const getVeiculos = useCallback(async () => {
    if (Placa.length === 0) {
      setChassi('')
      setTextMarcaModelo('')
      setTextCor('')
      setNomeProprietario('')
      setEnderecoProprietario('')
      setIdProprietario(0)
      setIdVeiculo(0)
      setNomeCondutorAuto('')
      setCpfCondutorAuto('')
      setCnhCondutorAuto('')
      setCategoriaCnhCondutorAuto('')
    } else {
      try {
        const response = await api.get('Veiculo/pesquisa-por-placa', {
          params: {
            placa: Placa
          }
        })

        const veiculos = response.data.data

        setIdVeiculo(veiculos.id)
      } catch (error) {
        if (Placa.length > 0) {
          setErroVeiculo('Veículo não encontrado')
          setChassi('')
          setTextMarcaModelo('')
          setTextCor('')
          setPrefixoVeiculo('')
          setNomeProprietario('')
          setCpfProprietarioValue('')
          setCnhProprietarioValue('')
          setEnderecoProprietario('')
          setIdVeiculo(0)
          setIdProprietario(0)
        }
      }
    }
  }, [Placa])

  useEffect(() => {
    api
      .get(`Permissionario/pesquisa-veiculo?veiculoId=${idVeiculo}`)
      .then((veiculosCadastrados) => {
        if (veiculosCadastrados.data.data !== null) {
          const infosVeiculo = veiculosCadastrados.data.data

          setErroVeiculo('')
          setTextMarcaModelo(
            infosVeiculo.veiculo.marcaModelo === null ? '' : infosVeiculo.veiculo.marcaModelo.descricao
          )
          setIdMarcaModelo(infosVeiculo.veiculo.marcaModeloId)
          setTextCor(infosVeiculo.veiculo.cor === null ? '' : infosVeiculo.veiculo.cor.descricao)
          setIdCor(infosVeiculo.veiculo.corId)
          // setTextMunicipio(infosVeiculo.veiculo.municipio === null ? '' : infosVeiculo.veiculo.municipio.nome)
          setIdMunicipio(infosVeiculo.veiculo.municipioId)
          // setUf(infosVeiculo.municipio.uf)
          setPrefixoVeiculo(infosVeiculo.veiculo.prefixo === null ? '' : infosVeiculo.veiculo.prefixo)
          // setNomeProprietario(infosVeiculo.proprietario.nome)
          // setCpfProprietarioValue(infosVeiculo.proprietario.cpf)
          // setCnhProprietarioValue(infosVeiculo.proprietario.cnh)
          // setEnderecoProprietario(infosVeiculo.proprietario.endereco)
          // setIdProprietario(infosVeiculo.proprietario.id)
          setChassi(infosVeiculo.veiculo.numeroChassi === null ? '' : infosVeiculo.numeroChassi)
          setCondutoresSelecionados(infosVeiculo.condutores)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }, [idVeiculo])

  const [filterCondutorAuto, setFilterCondutorAuto] = useState([])
  const [nomeCondutorAuto, setNomeCondutorAuto] = useState('')

  const onChangeNomeCondutorAuto = useCallback(
    (e) => {
      e.preventDefault()
      setNomeCondutorAuto(e.target.value)

      if (idCondutorSelecionado !== null) {
        const Filtro = condutoresSelecionados.filter(
          (value) =>
            value.nome.toLowerCase().includes(e.target.value.toLowerCase()) ||
            value.codigo?.toString().includes(e.target.value)
        )

        setFilterCondutorAuto(Filtro)
      }
    },
    [condutoresSelecionados]
  )

  const [cpfCondutorAuto, setCpfCondutorAuto] = useState('')
  const [cnhCondutorAuto, setCnhCondutorAuto] = useState('')
  const [categoriaCnhCondutorAuto, setCategoriaCnhCondutorAuto] = useState('')

  function selecionaCondutor(dado) {
    if (dado !== null && dado !== 0) {
      setNomeCondutorAuto(dado.nome)
      setIdCondutorSelecionado(dado.id)
      setCpfCondutorAuto(dado.cpF_CNPJ)
      setCnhCondutorAuto(dado.cnh)
      setCategoriaCnhCondutorAuto(dado.categoriaCNH)
      setFilterCondutorAuto([])
    } else {
      setIdCondutorSelecionado(dado)
      setNomeCondutorAuto('')
    }
  }

  useEffect(() => {
    if (!nomeCondutorAuto) {
      setFilterCondutorAuto([])
      setCpfCondutorAuto('')
      setCnhCondutorAuto('')
      setCategoriaCnhCondutorAuto('')
    }
  }, [nomeCondutorAuto])

  const [filterCor, setFilterCor] = useState([])
  const [idCor, setIdCor] = useState(0)
  const [textCor, setTextCor] = useState('')

  useEffect(() => {
    api
      .get('/Veiculo/cores')
      .then((response) => {
        setCor(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  const onChangeCor = useCallback(
    (e) => {
      e.preventDefault()
      setTextCor(e.target.value)

      const Filtro = cor.filter((value) => value.descricao.toLowerCase().includes(e.target.value.toLowerCase()))

      setFilterCor(Filtro)
    },
    [cor]
  )

  useEffect(() => {
    if (!textCor) {
      setFilterCor([])
      setIdCor(0)
    }
  }, [textCor])

  function selecionaCor(dado) {
    setTextCor(dado.descricao)
    setIdCor(dado.id)
    setFilterCor([])
  }

  const [filterMarcaModelo, setFilterMarcaModelo] = useState([])
  const [idMarcaModelo, setIdMarcaModelo] = useState(0)
  const [textMarcaModelo, setTextMarcaModelo] = useState('')

  useEffect(() => {
    api
      .get('/Veiculo/marcas-modelos')
      .then((response) => {
        setMarcaModelo(response.data.data)
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  const onChangeMarcaModelo = useCallback(
    (e) => {
      e.preventDefault()
      setTextMarcaModelo(e.target.value)

      if (e.target.value.length > 2) {
        const Filtro = marcaModelo.filter((value) =>
          value.descricao.toLowerCase().includes(e.target.value.toLowerCase())
        )

        setFilterMarcaModelo(Filtro)
      }
    },
    [marcaModelo]
  )

  useEffect(() => {
    if (!textMarcaModelo) {
      setFilterMarcaModelo([])
      setIdMarcaModelo(0)
    }
  }, [textMarcaModelo])

  function selecionaMarcaModelo(dado) {
    setTextMarcaModelo(dado.descricao)
    setIdMarcaModelo(dado.id)
    setFilterMarcaModelo([])
  }

  const [cpfProprietarioValue, setCpfProprietarioValue] = useState('')
  const [cnhProprietarioValue, setCnhProprietarioValue] = useState('')

  const [cpfNovoProprietarioValue, setCpfNovoProprietarioValue] = useState('')
  const [cpfNovoCondutorValue, setCpfNovoCondutorValue] = useState('')
  const [telefoneNovoProprietarioValue, setTelefoneNovoProprietarioValue] = useState('')
  const [telefoneNovoCondutorValue, setTelefoneNovoCondutorValue] = useState('')
  const [telefoneEdicaoProprietarioValue, setTelefoneEdicaoProprietarioValue] = useState('')
  const [telefoneEdicaoCondutorValue, setTelefoneEdicaoCondutorValue] = useState('')
  const [cepNovoProprietarioValue, setCepNovoProprietarioValue] = useState('')
  const [cepNovoCondutorValue, setCepNovoCondutorValue] = useState('')
  const [cepEdicaoProprietarioValue, setCepEdicaoProprietarioValue] = useState('')
  const [cepEdicaoCondutorValue, setCepEdicaoCondutorValue] = useState('')

  const [cpfCondutorValue, setCpfCondutorValue] = useState('')
  const [cnhCondutorValue, setCnhCondutorValue] = useState('')

  const [cpfAgenteValue, setCpfAgenteValue] = useState('')

  const inputCpfProprietarioMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['999.999.999-99', '99.999.999/9999-99'])
    setCpfProprietarioValue(maskedValue)
  }

  const inputCpfNovoProprietarioMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['999.999.999-99', '99.999.999/9999-99'])
    setCpfNovoProprietarioValue(maskedValue)
  }

  const inputCnhProprietarioMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['99999999999'])
    setCnhProprietarioValue(maskedValue)
  }

  const inputCpfCondutorMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['999.999.999-99', '99.999.999/9999-99'])
    setCpfCondutorValue(maskedValue)
  }

  const inputCpfNovoCondutorMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['999.999.999-99', '99.999.999/9999-99'])
    setCpfNovoCondutorValue(maskedValue)
  }

  const inputCnhCondutorMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['99999999999'])
    setCnhCondutorValue(maskedValue)
  }

  const inputCpfAgenteMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['999.999.999-99'])
    setCpfAgenteValue(maskedValue)
  }

  const inputTelefoneNovoProprietarioMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['(99) 99999-9999'])
    setTelefoneNovoProprietarioValue(maskedValue)
  }

  const inputTelefoneNovoCondutorMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['(99) 99999-9999'])
    setTelefoneNovoCondutorValue(maskedValue)
  }

  const inputTelefoneEdicaoProprietarioMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['(99) 99999-9999'])
    setTelefoneEdicaoProprietarioValue(maskedValue)
  }

  const inputTelefoneEdicaoCondutorMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['(99) 99999-9999'])
    setTelefoneEdicaoCondutorValue(maskedValue)
  }

  const inputCepNovoProprietarioMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['99999-999'])
    setCepNovoProprietarioValue(maskedValue)
  }

  const inputCepNovoCondutorMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['99999-999'])
    setCepNovoCondutorValue(maskedValue)
  }

  const inputCepEdicaoProprietarioMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['99999-999'])
    setCepEdicaoProprietarioValue(maskedValue)
  }

  const inputCepEdicaoCondutorMask = (e) => {
    const originalValue = unMask(e.target.value)
    const maskedValue = mask(originalValue, ['99999-999'])
    setCepEdicaoCondutorValue(maskedValue)
  }

  const [typeInput, setTypeInput] = useState('ReadOnly')
  const [showSelectLocal, setShowSelectLocal] = useState(false)
  const [enquadramentoRequired, setEnquadramentoRequired] = useState(true)

  useEffect(() => {
    if (serviceValue === 50) {
      setTypeInput('')
      setEnquadramentoRequired(false)
    } else {
      setTypeInput('ReadOnly')
      setPlaca('')
      setTextCor('')
      setTextMarcaModelo('')
      setNomeProprietario('')
      setTextMunicipio('')
      setNomeCondutorAuto('')
      setIdCondutorSelecionado(0)
      setCpfCondutorAuto('')
      setCnhCondutorAuto('')
      setUf('')
      setCnhProprietarioValue('')
      setCpfProprietarioValue('')
      setEnderecoProprietario('')
      setEnquadramentoRequired(true)
    }

    if (serviceValue === 10) {
      setShowSelectLocal(true)
    } else {
      setShowSelectLocal(false)
    }
  }, [serviceValue])

  const [rowsEnquadramento, setRowsEnquadramento] = useState(1)

  useEffect(() => {
    if (!numeroEnquadramento) {
      setRowsEnquadramento(1)
    }

    if (numeroEnquadramento.length > 55 && numeroEnquadramento.length < 100) {
      setRowsEnquadramento(2)
    } else if (numeroEnquadramento.length > 100) {
      setRowsEnquadramento(3)
    }
  }, [numeroEnquadramento])

  const [agenteInfrator, setAgenteInfrator] = useState('')
  const [filterAgente, setFilterAgente] = useState([])
  const [idAgente, setIdAgente] = useState(0)
  // const [numeroAgente, setNumeroAgente] = useState('')

  const onChangeAgente = useCallback(
    (e) => {
      e.preventDefault()
      setAgenteInfrator(e.target.value)

      const Filtro = Agentes.filter((value) => value.id.toString().includes(e.target.value))

      setFilterAgente(Filtro)
    },
    [Agentes]
  )

  useEffect(() => {
    if (!agenteInfrator) {
      setFilterAgente([])
      setIdAgente(0)
      // setNumeroAgente('')
    }
  }, [agenteInfrator])

  function selecionaAgente(dado) {
    setAgenteInfrator(`${dado.id} - ${dado.nome}`)
    setIdAgente(dado.id)
    // setNumeroAgente(dado.numero)
    setFilterAgente([])
  }

  const current = new Date()
  const date = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current
    .getDate()
    .toString()
    .padStart(2, '0')}`

  const [dataInfracao, setDataInfracao] = useState(date)
  const [hora, setHora] = useState('')

  const validaForm = yup.object({
    servicoId: yup.number().required(),
    sentido: yup.number().required(),
    municipio: yup.string(),
    placa: yup.string(),
    endereco: yup.string().required(),
    numeroEndereco: yup.string().required(),
    // nomeCondutor: yup.string().required(),
    // categoriaCNH: yup.number().required(),
    // cnhCondutor: yup.string().required(),
    // cpfCondutor: yup.string().required(),
    agenteInfrator: yup.string().required()
  })

  function erroForm() {
    return console.log('error')
  }

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validaForm)
  })

  const scrollInicio = () => {
    scroller.scrollTo('topo-talao', {
      duration: 400,
      delay: 0,
      smooth: 'easeInOutQuart'
    })
  }

  const submitForm = useCallback(() => {
    setSuccess(true)
    setModalSuccessShow(true)
    scrollInicio()
    atualizaInfracoes()
    setFocus('numeroAuto')
    setTextMunicipio('')
    setUf('')
    setPlaca('')
    setChassi('')
    setPrefixoVeiculo('')
    setIdVeiculo(0)
    setIdCondutorSelecionado(0)
    setTextMarcaModelo('')
    setTextCor('')
    setNomeProprietario('')
    setHora('')
    setnumeroEnquadramento('')
    setNomeCondutorAuto('')
    setCpfCondutorAuto('')
    setCnhCondutorAuto('')
    setCategoriaCnhCondutorAuto('')
    setDescricaoEnquadramento('')
    setCpfProprietarioValue('')
    setCnhProprietarioValue('')
    setCnhCondutorValue('')
    setCpfCondutorValue('')
    setEnderecoProprietario('')
    setAgenteInfrator('')
    setSelectedOptionsInfracao([])
    setValuesOptionsInfracao([])

    if (selectedImages) {
      hideOption()
      setMostraOpcao(true)
      setSelectedImages(null)
      setSrcImages([])
    }
  }, [hideOption, selectedImages, setFocus, setSelectedImages, setSrcImages])

  const [medidasAdministrativas, setMedidasAdministrativas] = useState([])

  const [modalMedidasAdministrativas, setModalMedidasAdministrativas] = useState(false)

  const [idInfracao, setIdInfracao] = useState(0)

  const [messageMedidasAdmin, setMessageMedidasAdmin] = useState('')

  const enviaForm = useCallback(
    (data) => {
      const dadosComImagem = {
        numeroAuto: data.numeroAuto.length > 0 ? data.numeroAuto.trim() : null,
        imagens: arrayImagens.filter((imgs) => imgs.tipoImagemId !== null),
        tiposInfracaoId: valuesOptionsInfracao,
        tipoServicoId: serviceValue,
        veiculoId: idVeiculo,
        condutorId: idCondutorSelecionado,
        pesquisaClandestinoId: idProprietario,
        pesquisaClandestino:
          serviceValue === 50
            ? {
                placa: Placa,
                numeroChassi: chassi,
                proprietarioId: idProprietario,
                proprietario: {
                  nome: 'Jose',
                  cpf: '098.900.470-80',
                  cnh: '5626596230',
                  endereco: 'rua clandestina',
                  numeroEndereco: '20',
                  complemento: null,
                  cep: '08887-090',
                  bairro: 'Centro',
                  estado: 'SP',
                  municipioId: 6477,
                  email: null,
                  celular: null
                },
                marcaModeloId: idMarcaModelo,
                corId: idCor,
                municipioId: idMunicipio
              }
            : null,
        dataInfracao: `${dataInfracao}T${hora}`,
        sentido: Number(data.sentido),
        endereco: data.endereco.trim(),
        numeroEndereco: data.numeroEndereco.trim(),
        enquadramentoId: idEnquadramento,
        descricao: descricaoEnquadramento.trim(),
        observacao: data.observacao.length > 0 ? data.observacao.trim() : null,
        condutor:
          idCondutorSelecionado === null
            ? {
                nome: data.nomeCondutor.trim(),
                cnh: data.cnhCondutor.trim(),
                cpF_CNPJ: data.cpfCondutor.trim(),
                categoriaCNH: data.categoriaCNH.toString(),
                endereco: data.enderecoCondutor.trim(),
                numeroEndereco: data.numeroEnderecoCondutor.length > 0 ? data.numeroEnderecoCondutor : null,
                complemento: data.complementoCondutor.lenght > 0 ? data.complementoCondutor : null,
                cep: data.cepNovoCondutor.trim(),
                bairro: data.bairroCondutor.trim(),
                estado: uf,
                municipioId: idMunicipio,
                email: data.emailCondutor.length > 0 ? data.emailCondutor : null,
                celular: data.celularNovoCondutor.length > 0 ? data.celularNovoCondutor : null,
                codigo: null
              }
            : null,
        agenteId: idAgente
      }

      api
        .post('Infracao', dadosComImagem)
        .then((response) => {
          if (response.status === 200) {
            if (response.data.data.temMedidaAdministrativa === true) {
              setMessageMedidasAdmin(response.data.message)
              setMedidasAdministrativas(response.data.data.medidasAdministrativas)
              setIdInfracao(response.data.data.id)
              setFocus('numeroAuto')
              scrollInicio()
              setModalMedidasAdministrativas(true)
            } else {
              setMessageSuccess(response.data.message)
              submitForm()
            }
          }
        })
        .catch((error) => {
          console.log(error)
          if (error.response.status === 400 || error.response.status === 500) {
            if (error.response.data.errors) {
              console.log(error.response.data.errors)
              const mensagensErro = Object.values(error.response.data.errors)
              setMessageFalha(mensagensErro.map((mensagens) => mensagens.toString()))
              setFalha(true)
              setModalFalhaShow(true)
            } else {
              setMessageFalha([error.response.data.message])
              setFalha(true)
              setModalFalhaShow(true)
            }
          }
        })
    },
    [
      Placa,
      arrayImagens,
      chassi,
      dataInfracao,
      descricaoEnquadramento,
      hora,
      idAgente,
      idCondutorSelecionado,
      idCor,
      idEnquadramento,
      idMarcaModelo,
      idMunicipio,
      idProprietario,
      idVeiculo,
      serviceValue,
      setFocus,
      submitForm,
      uf,
      valuesOptionsInfracao
    ]
  )

  const contextValues = useMemo(
    () => ({
      TiposInfracao,
      ModalidadeServico,
      Enquadramento,
      Sentidos,
      Documentos,
      TiposImagem,
      optionsTipoInfracao,
      selectedOptionsInfracao,
      setSelectedOptionsInfracao,
      sendValuesOptionsInfracao,
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
      setTextMunicipio,
      setUf,
      onChangeMunicipio,
      filterMunicipio,
      selecionaMunicipio,
      uf,
      idMunicipio,
      setIdMunicipio,
      numeroEnquadramento,
      filterEnquadramento,
      idEnquadramento,
      descricaoEnquadramento,
      onChangeEnquadramento,
      selecionaEnquadramento,
      onChangePlaca,
      Placa,
      setPlaca,
      setPrefixoVeiculo,
      getVeiculos,
      erroVeiculo,
      prefixoVeiculo,
      chassi,
      setChassi,
      idMarcaModelo,
      textMarcaModelo,
      setMarcaModelo,
      textCor,
      setCor,
      filterCor,
      onChangeCor,
      selecionaCor,
      nomeCondutorAuto,
      onChangeNomeCondutorAuto,
      filterCondutorAuto,
      cpfCondutorAuto,
      cnhCondutorAuto,
      categoriaCnhCondutorAuto,
      selecionaCondutor,
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
      cpfCondutorValue,
      inputCpfCondutorMask,
      cnhProprietarioValue,
      inputCnhProprietarioMask,
      cpfProprietarioValue,
      cpfNovoProprietarioValue,
      cpfNovoCondutorValue,
      cepNovoProprietarioValue,
      cepNovoCondutorValue,
      cepEdicaoProprietarioValue,
      cepEdicaoCondutorValue,
      telefoneNovoProprietarioValue,
      telefoneNovoCondutorValue,
      telefoneEdicaoProprietarioValue,
      telefoneEdicaoCondutorValue,
      inputCpfProprietarioMask,
      inputCpfNovoProprietarioMask,
      inputCpfNovoCondutorMask,
      inputCepNovoProprietarioMask,
      inputCepNovoCondutorMask,
      inputCepEdicaoProprietarioMask,
      inputCepEdicaoCondutorMask,
      inputTelefoneNovoProprietarioMask,
      inputTelefoneNovoCondutorMask,
      inputTelefoneEdicaoProprietarioMask,
      inputTelefoneEdicaoCondutorMask,
      enderecoProprietario,
      onChangeEnderecoProprietario,
      cpfAgenteValue,
      setCpfAgenteValue,
      inputCpfAgenteMask,
      cnhCondutorValue,
      inputCnhCondutorMask,
      success,
      modalSuccessShow,
      setModalSuccessShow,
      falha,
      modalFalhaShow,
      setModalFalhaShow,
      messageSuccess,
      messageFalha,
      reset,
      Agentes,
      agenteInfrator,
      Corporacao,
      filterAgente,
      onChangeAgente,
      selecionaAgente,
      atualizaCorporacao,
      TiposUsuario,
      serviceValue,
      setServiceValue,
      ehAtualizacao,
      setEhAtualizacao,
      idVeiculoSelecionado,
      setIdVeiculoSelecionado,
      idVeiculo,
      setIdVeiculo,
      idProprietarioSelecionado,
      idProprietarioAtual,
      setIdProprietarioSelecionado,
      setIdProprietarioAtual,
      idCondutorSelecionado,
      setIdCondutorSelecionado,
      atualizaAgentes,
      medidasAdministrativas,
      modalMedidasAdministrativas,
      setModalMedidasAdministrativas,
      submitForm,
      idInfracao,
      setMessageSuccess,
      messageMedidasAdmin,
      setMessageFalha,
      setFalha,
      enquadramentoRequired,
      infracoesRegistradas,
      atualizaInfracoes,
      // getEstados,
      valueTipoNotificacao,
      setValueTipoNotificacao,
      setCpfNovoProprietarioValue,
      setCpfNovoCondutorValue,
      setCepNovoProprietarioValue,
      setCepNovoCondutorValue,
      setCepEdicaoProprietarioValue,
      setCepEdicaoCondutorValue,
      setTelefoneNovoProprietarioValue,
      setTelefoneNovoCondutorValue,
      setTelefoneEdicaoProprietarioValue,
      setTelefoneEdicaoCondutorValue,
      setTextMarcaModelo,
      setIdMarcaModelo,
      lotesGerados,
      atualizaLotesGerados,
      Usuarios,
      atualizaUsuarios,
      feriadosNacionais,
      feriadosMunicipais,
      tiposRelatorio,
      Veiculos,
      Permissionarios,
      atualizaPermissionarios,
      Proprietarios,
      proprietariosSelecionados,
      atualizaProprietarios,
      setProprietariosSelecionados,
      Condutores,
      condutoresSelecionados,
      condutoresInativos,
      setCondutoresInativos,
      atualizaCondutores,
      setCondutoresSelecionados,
      // Estados,
      // OptionsEstados,
      cor,
      marcaModelo,
      diasDefesa,
      diasVencimento,
      diasJarit,
      valorUnidadeFinanceira,
      nomeUnidadeFinanceira
    }),
    [
      TiposInfracao,
      ModalidadeServico,
      Enquadramento,
      Sentidos,
      Documentos,
      TiposImagem,
      optionsTipoInfracao,
      selectedOptionsInfracao,
      sendValuesOptionsInfracao,
      typeInput,
      showSelectLocal,
      rowsEnquadramento,
      Locais,
      register,
      handleSubmit,
      enviaForm,
      errors,
      textMunicipio,
      onChangeMunicipio,
      filterMunicipio,
      uf,
      idMunicipio,
      numeroEnquadramento,
      filterEnquadramento,
      idEnquadramento,
      descricaoEnquadramento,
      onChangeEnquadramento,
      Placa,
      getVeiculos,
      erroVeiculo,
      prefixoVeiculo,
      chassi,
      idMarcaModelo,
      textMarcaModelo,
      textCor,
      filterCor,
      onChangeCor,
      nomeCondutorAuto,
      onChangeNomeCondutorAuto,
      filterCondutorAuto,
      cpfCondutorAuto,
      cnhCondutorAuto,
      categoriaCnhCondutorAuto,
      onChangeMarcaModelo,
      filterMarcaModelo,
      nomeProprietario,
      dataInfracao,
      hora,
      errorLoad,
      modalShow,
      cpfCondutorValue,
      cnhProprietarioValue,
      cpfProprietarioValue,
      cpfNovoProprietarioValue,
      cpfNovoCondutorValue,
      cepNovoProprietarioValue,
      cepNovoCondutorValue,
      cepEdicaoProprietarioValue,
      cepEdicaoCondutorValue,
      telefoneNovoProprietarioValue,
      telefoneNovoCondutorValue,
      telefoneEdicaoProprietarioValue,
      telefoneEdicaoCondutorValue,
      enderecoProprietario,
      cpfAgenteValue,
      cnhCondutorValue,
      success,
      modalSuccessShow,
      falha,
      modalFalhaShow,
      messageSuccess,
      messageFalha,
      reset,
      Agentes,
      agenteInfrator,
      Corporacao,
      filterAgente,
      onChangeAgente,
      TiposUsuario,
      serviceValue,
      ehAtualizacao,
      idVeiculoSelecionado,
      idVeiculo,
      idProprietarioSelecionado,
      idProprietarioAtual,
      idCondutorSelecionado,
      medidasAdministrativas,
      modalMedidasAdministrativas,
      submitForm,
      idInfracao,
      messageMedidasAdmin,
      enquadramentoRequired,
      infracoesRegistradas,
      atualizaInfracoes,
      valueTipoNotificacao,
      lotesGerados,
      Usuarios,
      feriadosNacionais,
      feriadosMunicipais,
      tiposRelatorio,
      Veiculos,
      Permissionarios,
      Proprietarios,
      proprietariosSelecionados,
      Condutores,
      condutoresSelecionados,
      condutoresInativos,
      cor,
      marcaModelo,
      diasDefesa,
      diasVencimento,
      diasJarit,
      valorUnidadeFinanceira,
      nomeUnidadeFinanceira
    ]
  )

  return <DadosContext.Provider value={contextValues}>{children}</DadosContext.Provider>
}
