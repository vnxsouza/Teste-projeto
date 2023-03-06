import React, { useContext } from 'react'

import './NotFound.css'
import SideBar from '../../components/SideBarLateral'
import { AuthContext } from '../../contexts/AuthContext'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'

function NotFound() {
  const { classSideNav } = useContext(CondicionaisFormContext)

  const { Permissoes } = useContext(AuthContext)

  return (
    <div className="content">
      {Permissoes.toString() === 'Administrador' && (
        <div className="sideNavLateral">
          <SideBar />
        </div>
      )}

      <div className={`${classSideNav === 'sidenav' ? 'notFoundComSideNav' : 'notFound'}`}>
        <h2 className="mt-3">Página não encontrada</h2>
        <span>A página solicitada não existe. Por favor, verifique o endereço digitado e tente novamente. </span>
      </div>
    </div>
  )
}

export default NotFound
