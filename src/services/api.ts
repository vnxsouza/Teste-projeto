import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:7130/api/v1'
})

export const LoginUser = async (userName, senha) => api.post('/Account/Login', { userName, senha })

export const CreateUser = async (primeiroNome, ultimoNome, email, userName, senha, confirmacaoSenha, tipoUsuario) =>
  api.post('/Account/CriarUsuario', { primeiroNome, ultimoNome, email, userName, senha, confirmacaoSenha, tipoUsuario })

export default api
