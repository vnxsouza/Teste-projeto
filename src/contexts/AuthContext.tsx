import { createContext, ReactNode, useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import api, { LoginUser, CreateUser } from '../services/api'

interface CriaUsuarioParams {
  primeiroNome: string
  ultimoNome: string
  email: string
  userName: string
  senha: string | number
  confirmacaoSenha: string | number
  tipoUsuario: string
}

interface AuthContextProps {
  Permissoes: any
  setModalUserCreatedFailed: React.Dispatch<React.SetStateAction<boolean>>
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>
  setModalUserCreated: React.Dispatch<React.SetStateAction<boolean>>
  permissions: string
  user: string
  errorLogin: string
  errorSignup: string
  messageModalSignup: string
  clienteCode: number
  authenticated: boolean
  loading: boolean
  errorLoad: boolean
  modalShow: boolean
  userCreated: boolean
  modalUserCreated: boolean
  userCreatedFailed: boolean
  modalUserCreatedFailed: boolean
  loginUsuario: (userName: string, senha: string) => Promise<void>
  logout: () => void
  criaUsuario: (criaUsuario: CriaUsuarioParams) => void
}

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorLogin, setErrorLogin] = useState('')
  const [errorSignup, setErrorSignup] = useState('')
  const [errorLoad, setErrorLoad] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [userCreated, setUserCreated] = useState(false)
  const [modalUserCreated, setModalUserCreated] = useState(false)
  const [userCreatedFailed, setUserCreatedFailed] = useState(false)
  const [modalUserCreatedFailed, setModalUserCreatedFailed] = useState(false)
  const [messageModalSignup, setMessageModalSignup] = useState('')
  const [clienteCode, setClienteCode] = useState(0)
  const [Permissoes, setPermissoes] = useState([])
  const [permissions, setPermissions] = useState('')

  useEffect(() => {
    const userRecovered = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    const codigoCliente = Number(localStorage.getItem('codigoCliente'))

    if (userRecovered && token && codigoCliente) {
      setUser(userRecovered)
      setClienteCode(codigoCliente)
      api.defaults.headers['Authorization'] = `Bearer ${token}`
    }

    setLoading(false)
  }, [])

  const loginUsuario = useCallback(
    async (userName, senha) => {
      if (!userName || !senha) {
        if (!userName && !senha) {
          setErrorLogin('Preencha todos os campos')
        } else if (!userName) {
          setErrorLogin('Usuário é obrigatório')
        } else if (!senha) {
          setErrorLogin('A senha é obrigatória')
        }
      } else {
        try {
          const response = await LoginUser(userName, senha)

          if (response.data.success === true) {
            const userLogged = userName
            const { token } = response.data.data.token
            const { codigoCliente } = response.data.data

            localStorage.setItem('user', userLogged)
            localStorage.setItem('token', token)
            localStorage.setItem('codigoCliente', codigoCliente)

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            api
              .get('/Account/Permissoes')
              .then((response2) => {
                setPermissoes(response2.data.data)
                setPermissions(response2.data.data.toString())
              })
              .catch((error) => {
                console.log(error)
              })

            setUser(userLogged)
            setClienteCode(Number(codigoCliente))
            navigate('/digitalizacao')
            setErrorLogin('')
          }
        } catch (error: any) {
          if (error.response.status === 400) {
            if (error.response.data.success === false) {
              setErrorLogin(error.response.data.message)
            }
            if (error.response.data.errors) {
              setErrorLogin(error.response.data.errors.Senha)
            }
          } else {
            setErrorLoad(true)
            setModalShow(true)
          }
        }
      }
    },
    [navigate]
  )

  useEffect(() => {
    api
      .get('/Account/Permissoes')
      .then((response) => {
        setPermissoes(response.data.data)
        setPermissions(response.data.data.toString())
      })
      .catch((error) => {
        console.log('error')
      })
  }, [])

  const criaUsuario = async ({
    primeiroNome,
    ultimoNome,
    email,
    userName,
    senha,
    confirmacaoSenha,
    tipoUsuario
  }: CriaUsuarioParams) => {
    if (!primeiroNome || !ultimoNome || !email || !userName || !senha || !confirmacaoSenha) {
      setErrorSignup('Preencha todos os campos')
    } else if (senha !== confirmacaoSenha) {
      setErrorSignup('As senhas não conferem')
    } else {
      try {
        const response = await CreateUser(
          primeiroNome,
          ultimoNome,
          email,
          userName,
          senha,
          confirmacaoSenha,
          tipoUsuario
        )
        if (response.data.success === true) {
          const createdUser = userName
          const { token } = response.data.data

          localStorage.setItem('user_db', JSON.stringify(createdUser))
          localStorage.setItem('token_db', JSON.stringify(token))

          api.defaults.headers['Authorization'] = `Bearer ${token}`

          setMessageModalSignup(response.data.message)
          setUserCreated(true)
          setModalUserCreated(true)
          setErrorSignup('')
          return
        }
      } catch (error: any) {
        console.log(error)
        if (error.response.status === 400 || error.response.status === 500) {
          if (error.response.data.success === false) {
            setMessageModalSignup(error.response.data.message)
            setUserCreatedFailed(true)
            setModalUserCreatedFailed(true)
          }
        } else if (error.response.status === 403) {
          setMessageModalSignup('Você não tem permissão para criar um novo usuário')
          setUserCreatedFailed(true)
          setModalUserCreatedFailed(true)
        } else {
          setErrorLoad(true)
          setModalShow(true)
        }
      }
    }
  }

  const logout = useCallback(() => {
    localStorage.removeItem(user)
    localStorage.removeItem('token')
    localStorage.removeItem('clienteCode')

    api.defaults.headers['Authorization'] = null

    setUser(null)
    setClienteCode(0)
    navigate('/')
  }, [navigate, user])

  const contextValues = useMemo(
    () => ({
      authenticated: !!user,
      user,
      errorLogin,
      errorSignup,
      loading,
      loginUsuario,
      logout,
      criaUsuario,
      errorLoad,
      modalShow,
      setModalShow,
      userCreated,
      modalUserCreated,
      setModalUserCreated,
      userCreatedFailed,
      modalUserCreatedFailed,
      setModalUserCreatedFailed,
      messageModalSignup,
      clienteCode,
      Permissoes,
      permissions
    }),
    [
      Permissoes,
      clienteCode,
      errorLoad,
      errorLogin,
      errorSignup,
      loading,
      loginUsuario,
      logout,
      messageModalSignup,
      modalShow,
      modalUserCreated,
      modalUserCreatedFailed,
      permissions,
      user,
      userCreated,
      userCreatedFailed
    ]
  )

  return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>
}
