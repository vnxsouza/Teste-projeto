import ConfiguracoesCondutores from 'pages/ConfiguracoesCondutores'
import ConfiguracoesProprietarios from 'pages/ConfiguracoesProprietarios'
import ControlePermissionarios from 'pages/ControlePermissionarios'
import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Header from './components/Header'
import NotAuhorizedUser from './components/NotAuthorizedUser'
import { AuthContext, AuthContextProvider } from './contexts/AuthContext'
import { CondicionaisFormContextProvider } from './contexts/CondicionaisFormContext'
import { DadosContextProvider } from './contexts/DadosContext'
import CriaAgente from './pages/configuracoesAgente'
import ConfiguracoesCorporacao from './pages/ConfiguracoesCorporacao'
import CriaUsuario from './pages/configuracoesUsuario'
import ControleDeTalao from './pages/ControleDeTalao'
import DigitacaoAuto from './pages/DigitacaoAuto'
import Home from './pages/Home'
import ListagemEnquadramentos from './pages/listagemEnquadramentos'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import PerfilUsuarios from './pages/perfilUsuarios'
import Relatorios from './pages/Relatorios'

interface PrivateProps {
  readonly children: JSX.Element
  readonly roles?: string
}

function Private({ children, roles }: PrivateProps) {
  const { authenticated, loading, Permissoes } = useContext(AuthContext)

  if (!roles && authenticated) {
    return children
  }

  if (loading) {
    return <div className="loading">Carregando...</div>
  }

  if (!authenticated) {
    return <Navigate to="/" />
  }

  return Permissoes.includes('Administrador') ? children : <NotAuhorizedUser />
}

function Rotas() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/home"
            element={
              <Private>
                <>
                  <Header />
                  <Home />
                </>
              </Private>
            }
          />

          <Route
            path="/geracaoDeLote"
            element={
              <Private>
                <CondicionaisFormContextProvider>
                  <DadosContextProvider>
                    <Header />
                    <Relatorios />
                  </DadosContextProvider>
                </CondicionaisFormContextProvider>
              </Private>
            }
          />

          <Route
            path="/controleDeLotes"
            element={
              <Private>
                <CondicionaisFormContextProvider>
                  <DadosContextProvider>
                    <Header />
                    <ControleDeTalao />
                  </DadosContextProvider>
                </CondicionaisFormContextProvider>
              </Private>
            }
          />

          <Route
            path="/digitalizacao"
            element={
              <Private>
                <CondicionaisFormContextProvider>
                  <DadosContextProvider>
                    <Header />
                    <DigitacaoAuto />
                  </DadosContextProvider>
                </CondicionaisFormContextProvider>
              </Private>
            }
          />

          <Route
            path="/configuracoesAgente"
            element={
              <Private>
                <CondicionaisFormContextProvider>
                  <Private roles="Administrador">
                    <DadosContextProvider>
                      <Header />
                      <CriaAgente />
                    </DadosContextProvider>
                  </Private>
                </CondicionaisFormContextProvider>
              </Private>
            }
          />

          <Route
            path="/configuracoesUsuario"
            element={
              <CondicionaisFormContextProvider>
                <Private roles="Administrador">
                  <DadosContextProvider>
                    <Header />
                    <CriaUsuario />
                  </DadosContextProvider>
                </Private>
              </CondicionaisFormContextProvider>
            }
          />

          <Route
            path="/configuracoesCorporacao"
            element={
              <CondicionaisFormContextProvider>
                <Private roles="Administrador">
                  <DadosContextProvider>
                    <Header />
                    <ConfiguracoesCorporacao />
                  </DadosContextProvider>
                </Private>
              </CondicionaisFormContextProvider>
            }
          />

          <Route
            path="/controlePermissionarios"
            element={
              <CondicionaisFormContextProvider>
                <Private roles="Administrador">
                  <DadosContextProvider>
                    <Header />
                    <ControlePermissionarios />
                  </DadosContextProvider>
                </Private>
              </CondicionaisFormContextProvider>
            }
          />

          <Route
            path="/configuracoesProprietarios"
            element={
              <CondicionaisFormContextProvider>
                <Private roles="Administrador">
                  <DadosContextProvider>
                    <Header />
                    <ConfiguracoesProprietarios />
                  </DadosContextProvider>
                </Private>
              </CondicionaisFormContextProvider>
            }
          />

          <Route
            path="/configuracoesCondutores"
            element={
              <CondicionaisFormContextProvider>
                <Private roles="Administrador">
                  <DadosContextProvider>
                    <Header />
                    <ConfiguracoesCondutores />
                  </DadosContextProvider>
                </Private>
              </CondicionaisFormContextProvider>
            }
          />

          <Route
            path="/enquadramentos"
            element={
              <Private>
                <CondicionaisFormContextProvider>
                  <Private roles="Administrador">
                    <DadosContextProvider>
                      <Header />
                      <ListagemEnquadramentos />
                    </DadosContextProvider>
                  </Private>
                </CondicionaisFormContextProvider>
              </Private>
            }
          />

          <Route
            path="/perfil"
            element={
              <Private>
                <CondicionaisFormContextProvider>
                  <DadosContextProvider>
                    <Header />
                    <PerfilUsuarios />
                  </DadosContextProvider>
                </CondicionaisFormContextProvider>
              </Private>
            }
          />

          <Route
            path="*"
            element={
              <CondicionaisFormContextProvider>
                <DadosContextProvider>
                  <Header />
                  <NotFound />
                </DadosContextProvider>
              </CondicionaisFormContextProvider>
            }
          />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default Rotas
