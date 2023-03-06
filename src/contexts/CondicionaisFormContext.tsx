import { createContext, useEffect, useState, useMemo, useCallback, ReactNode } from 'react'

interface srcImageProps {
  id: number
  readImage: string | ArrayBuffer
  extensaoImage: any
}

interface ImageType {
  imagemBase64: string
  extensao: string
  tipoImagemId: number | string
}

interface SecondImageType {
  id: number
  readImage: string | ArrayBuffer
  extensaoImage: string
  TipoImagem: number
}

interface CondicionaisFormContextProps {
  selectedImages: any
  srcImages: any
  onSelectFilePrincipal: (event: any) => void
  onSelectFilesSecundarios: (event: any) => void
  insereTipoImagemImagensSecundarias: (e: any, dado: any) => void
  srcSecondImages: any[]
  trocaImagem: (dado: any) => void
  removeImage: (id: any, dado: any) => void
  classSideNav: string
  textTipoImagemDefault: string
  srcImageDefault: string | undefined
  tipoImagemImageDefault: number
  tipoImagemImagensSecundarias: number
  mostraOpcaoSecundaria: boolean
  uploadSecundarioActive: boolean
  mostraOpcao: boolean
  collapseDadosAutoActive: boolean
  mostraDadosAuto: boolean
  collapseDadosVeiculoActive: boolean
  mostraDadosVeiculo: boolean
  collapseDadosInfracaoActive: boolean
  mostraDadosInfracao: boolean
  collapseDadosAgenteActive: boolean
  mostraDadosAgente: boolean
  collapseDadosCondutorActive: boolean
  mostraDadosCondutor: boolean
  messageRequiredTipoImagem: boolean
  tabelaVeiculos: boolean
  telaConfiguracoes: boolean
  cadastraVeiculos: boolean
  cadastroPermissionario: boolean
  arrayImagens: ImageType[]
  setSelectedImages: (image: string | null) => void
  hideOption: () => void
  hideOptionAndDelete: () => void
  setSrcImages: (images: srcImageProps[]) => void
  hideOptionSecundaria: () => void
  setUploadSecundarioActive: (value: React.SetStateAction<boolean>) => void
  setMostraOpcaoSecundaria: React.Dispatch<React.SetStateAction<boolean>>
  setMostraOpcao: React.Dispatch<React.SetStateAction<boolean>>
  ocultaDadosAuto: () => void
  ocultaDadosVeiculo: () => void
  ocultaDadosInfracao: () => void
  ocultaDadosAgente: () => void
  ocultaDadosCondutor: () => void
  closeMenuLateral: () => void
  openMenuLateral: () => void
  voltaTabela: () => void
  ativaConfiguracoesVeiculo: () => void
  ativaCadastroVeiculo: () => void
  ativaCadastroPermissionario: () => void
  setTipoImagemImageDefault: React.Dispatch<React.SetStateAction<number>>
  setTipoImagemImagensSecundarias: React.Dispatch<React.SetStateAction<number>>
  setMessageRequiredTipoImagem: React.Dispatch<React.SetStateAction<boolean>>
  setTextTipoImagemDefault: React.Dispatch<React.SetStateAction<string>>
}

interface CondicionaisFormContextProviderProps {
  children: ReactNode
}

export const CondicionaisFormContext = createContext({} as CondicionaisFormContextProps)

export function CondicionaisFormContextProvider({ children }: CondicionaisFormContextProviderProps) {
  const [selectedImages, setSelectedImages] = useState(null)
  const [srcImages, setSrcImages] = useState([])
  const [srcSecondImages, setSrcSecondImages] = useState<SecondImageType[]>([])

  const onSelectFilePrincipal = useCallback(
    (event) => {
      if (event.target.files && event.target.files[0]) {
        const imageFile = event.target.files[0]
        const reader = new FileReader()
        reader.onload = (x) => {
          setSelectedImages(imageFile)
          const idImg = Number(Math.random().toFixed(3)) * (4 - 1) + 1
          const objImage = {
            id: idImg,
            readImage: x.target.result,
            extensaoImage: imageFile.type.substring(6)
          }
          setSrcImages([...srcImages, objImage])
        }
        reader.readAsDataURL(imageFile)
      }
    },
    [srcImages]
  )

  const onSelectFilesSecundarios = useCallback((event) => {
    if (event.target.files && event.target.files[0]) {
      const imageFile = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (x) => {
        setSelectedImages(imageFile)
        const idImg = Number(Math.random().toFixed(3)) * (4 - 1) + 1
        const objImage = {
          id: idImg,
          readImage: x.target.result,
          extensaoImage: imageFile.type.substring(6),
          TipoImagem: null
        }
        setSrcSecondImages((prevState) => [...prevState, objImage])
      }
      reader.readAsDataURL(imageFile)
    }
  }, [])

  const [srcImageDefault, setSrcImageDefault] = useState()
  const [tipoImagemImageDefault, setTipoImagemImageDefault] = useState(0)
  const [tipoImagemImagensSecundarias, setTipoImagemImagensSecundarias] = useState(0)

  useEffect(() => {
    setSrcImageDefault(srcImages[0]?.readImage)
  }, [srcImages])

  function trocaImagem(dado) {
    setSrcImageDefault(dado.readImage)
  }

  const insereTipoImagemImagensSecundarias = useCallback(
    (e, dado) => {
      const tipoImagemAtual = e.target.value

      setSrcSecondImages(
        srcSecondImages.map((value) => {
          if (dado.readImage === value.readImage) {
            return {
              ...value,
              tipoImagemId: Number(tipoImagemAtual)
            }
          } else {
            return value
          }
        })
      )

      setArrayImagens((prevState) =>
        prevState.map((value) => {
          if (dado.readImage.split(',')[1] === value.imagemBase64) {
            return {
              ...value,
              tipoImagemId: Number(tipoImagemAtual)
            }
          } else {
            return value
          }
        })
      )
    },
    [srcSecondImages]
  )

  const removeImage = useCallback(
    (id, dado) => {
      setSrcImageDefault(srcImages[0].readImage)
      setSrcSecondImages(srcSecondImages.filter((objImage) => objImage.id !== id))
      setArrayImagens((prevState) => prevState.filter((srcImage) => srcImage.imagemBase64 !== dado))
    },
    [srcImages, srcSecondImages]
  )

  const [mostraOpcao, setMostraOpcao] = useState(true)
  const [mostraOpcaoSecundaria, setMostraOpcaoSecundaria] = useState(false)
  const [uploadSecundarioActive, setUploadSecundarioActive] = useState(false)

  function deleteHandler() {
    setSelectedImages(null)
    setSrcImages([])
    setUploadSecundarioActive(false)
  }

  const hideOption = useCallback(() => {
    setMostraOpcaoSecundaria(true)
    setMostraOpcao(!mostraOpcao)
    setClassSideNav('sideNavOculta')
  }, [mostraOpcao])

  const hideOptionSecundaria = () => {
    setMostraOpcao(false)
    setUploadSecundarioActive(true)
  }

  const hideOptionAndDelete = useCallback(() => {
    deleteHandler()
    hideOption()
    setSrcSecondImages([])
    setMostraOpcao(true)
    setClassSideNav('sidenav')
  }, [hideOption])

  const [arrayImagens, setArrayImagens] = useState<ImageType[]>([])
  const [messageRequiredTipoImagem, setMessageRequiredTipoImagem] = useState(false)
  const [textTipoImagemDefault, setTextTipoImagemDefault] = useState('TIPO DE IMAGEM')

  useEffect(() => {
    if (srcImages.length === 0) {
      setTextTipoImagemDefault('TIPO DE IMAGEM')
      setMessageRequiredTipoImagem(false)
      setTipoImagemImageDefault(0)
      setArrayImagens([])
    } else {
      const objetoFinalImagem = {
        imagemBase64: srcImages[0]?.readImage?.split(',')[1],
        extensao: `.${srcImages[0]?.extensaoImage}`,
        tipoImagemId: tipoImagemImageDefault
      }
      setArrayImagens([objetoFinalImagem])
    }
  }, [srcImages, tipoImagemImageDefault])

  useEffect(() => {
    srcSecondImages?.forEach((dado) => {
      if (typeof dado.readImage !== 'string') return

      const objetoFinalImagensSecundarias = {
        imagemBase64: dado.readImage?.split(',')[1],
        extensao: `.${dado.extensaoImage}`,
        tipoImagemId: dado.TipoImagem
      }
      setArrayImagens((prevState) => [...prevState, objetoFinalImagensSecundarias])
    })
  }, [srcSecondImages])

  const [mostraDadosAuto, setMostraDadosAuto] = useState(true)
  const [mostraDadosVeiculo, setMostraDadosVeiculo] = useState(true)
  const [mostraDadosInfracao, setMostraDadosInfracao] = useState(true)
  const [mostraDadosCondutor, setMostraDadosCondutor] = useState(true)
  const [mostraDadosAgente, setMostraDadosAgente] = useState(true)

  const [collapseDadosAutoActive, setCollapseDadosAutoActive] = useState(false)
  const [collapseDadosVeiculoActive, setCollapseDadosVeiculoActive] = useState(false)
  const [collapseDadosInfracaoActive, setCollapseDadosInfracaoActive] = useState(false)
  const [collapseDadosCondutorActive, setCollapseDadosCondutorActive] = useState(false)
  const [collapseDadosAgenteActive, setCollapseDadosAgenteActive] = useState(false)

  const ocultaDadosAuto = useCallback(() => {
    setCollapseDadosAutoActive(!collapseDadosAutoActive)
    setMostraDadosAuto(!mostraDadosAuto)
  }, [collapseDadosAutoActive, mostraDadosAuto])

  const ocultaDadosVeiculo = useCallback(() => {
    setCollapseDadosVeiculoActive(!collapseDadosVeiculoActive)
    setMostraDadosVeiculo(!mostraDadosVeiculo)
  }, [collapseDadosVeiculoActive, mostraDadosVeiculo])

  const ocultaDadosInfracao = useCallback(() => {
    setCollapseDadosInfracaoActive(!collapseDadosInfracaoActive)
    setMostraDadosInfracao(!mostraDadosInfracao)
  }, [collapseDadosInfracaoActive, mostraDadosInfracao])

  const ocultaDadosCondutor = useCallback(() => {
    setCollapseDadosCondutorActive(!collapseDadosCondutorActive)
    setMostraDadosCondutor(!mostraDadosCondutor)
  }, [collapseDadosCondutorActive, mostraDadosCondutor])

  const ocultaDadosAgente = useCallback(() => {
    setCollapseDadosAgenteActive(!collapseDadosAgenteActive)
    setMostraDadosAgente(!mostraDadosAgente)
  }, [collapseDadosAgenteActive, mostraDadosAgente])

  const [classSideNav, setClassSideNav] = useState('sidenav')

  function closeMenuLateral() {
    setClassSideNav('sideNavOculta')
  }

  function openMenuLateral() {
    setClassSideNav('sidenav')
  }

  useEffect(() => {
    if (window.innerWidth < 768) {
      setClassSideNav('sideNavOculta')
    }
  }, [])

  // eslint-disable-next-line func-names
  window.onresize = function () {
    const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (w < 768) {
      setClassSideNav('sideNavOculta')
    }
  }

  const [tabelaVeiculos, setTabelaVeiculos] = useState(true)
  const [telaConfiguracoes, setTelaConfiguracoes] = useState(false)
  const [cadastraVeiculos, setCadastraVeiculos] = useState(false)
  const [cadastroPermissionario, setCadastroPermissionario] = useState(false)

  function voltaTabela() {
    setTabelaVeiculos(true)
    setTelaConfiguracoes(false)
    setCadastraVeiculos(false)
    setCadastroPermissionario(false)
  }

  function ativaConfiguracoesVeiculo() {
    setTabelaVeiculos(false)
    setTelaConfiguracoes(true)
    setCadastraVeiculos(false)
    setCadastroPermissionario(false)
  }

  function ativaCadastroVeiculo() {
    setTabelaVeiculos(false)
    setTelaConfiguracoes(false)
    setCadastraVeiculos(true)
    setCadastroPermissionario(false)
  }

  function ativaCadastroPermissionario() {
    setTabelaVeiculos(false)
    setTelaConfiguracoes(false)
    setCadastraVeiculos(false)
    setCadastroPermissionario(true)
  }

  const contextValues = useMemo(
    () => ({
      srcImageDefault,
      trocaImagem,
      selectedImages,
      setSelectedImages,
      hideOption,
      removeImage,
      hideOptionAndDelete,
      srcImages,
      setSrcImages,
      mostraOpcaoSecundaria,
      uploadSecundarioActive,
      hideOptionSecundaria,
      setUploadSecundarioActive,
      setMostraOpcaoSecundaria,
      mostraOpcao,
      setMostraOpcao,
      onSelectFilePrincipal,
      onSelectFilesSecundarios,
      srcSecondImages,
      setSrcSecondImages,
      ocultaDadosAuto,
      collapseDadosAutoActive,
      mostraDadosAuto,
      tabelaVeiculos,
      telaConfiguracoes,
      cadastraVeiculos,
      cadastroPermissionario,
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
      closeMenuLateral,
      openMenuLateral,
      voltaTabela,
      ativaConfiguracoesVeiculo,
      ativaCadastroVeiculo,
      ativaCadastroPermissionario,
      arrayImagens,
      tipoImagemImageDefault,
      setTipoImagemImageDefault,
      tipoImagemImagensSecundarias,
      setTipoImagemImagensSecundarias,
      insereTipoImagemImagensSecundarias,
      messageRequiredTipoImagem,
      setMessageRequiredTipoImagem,
      textTipoImagemDefault,
      setTextTipoImagemDefault
    }),
    [
      arrayImagens,
      classSideNav,
      collapseDadosAgenteActive,
      collapseDadosAutoActive,
      collapseDadosCondutorActive,
      collapseDadosInfracaoActive,
      collapseDadosVeiculoActive,
      hideOption,
      hideOptionAndDelete,
      insereTipoImagemImagensSecundarias,
      messageRequiredTipoImagem,
      mostraDadosAgente,
      mostraDadosAuto,
      tabelaVeiculos,
      telaConfiguracoes,
      cadastraVeiculos,
      cadastroPermissionario,
      mostraDadosCondutor,
      mostraDadosInfracao,
      mostraDadosVeiculo,
      mostraOpcao,
      mostraOpcaoSecundaria,
      ocultaDadosAgente,
      ocultaDadosAuto,
      ocultaDadosCondutor,
      ocultaDadosInfracao,
      ocultaDadosVeiculo,
      onSelectFilePrincipal,
      onSelectFilesSecundarios,
      removeImage,
      selectedImages,
      srcImageDefault,
      srcImages,
      srcSecondImages,
      textTipoImagemDefault,
      tipoImagemImageDefault,
      tipoImagemImagensSecundarias,
      uploadSecundarioActive
    ]
  )

  return <CondicionaisFormContext.Provider value={contextValues}>{children}</CondicionaisFormContext.Provider>
}
