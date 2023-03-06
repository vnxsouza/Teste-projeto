import { AuthContext } from 'contexts/AuthContext'
import React, { useContext } from 'react'

import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'
import Header from '../Header'
import SideBar from '../SideBarLateral'
import './NotAuthorizedUser.css'

function NotAuhorizedUser() {
  const { classSideNav } = useContext(CondicionaisFormContext)
  const { Permissoes } = useContext(AuthContext)

  return (
    <>
      <Header />
      <div className="content">
        <div className="sideNavLateral">
          <SideBar />
        </div>

        {Permissoes.length > 0 && (
          <div className={`${classSideNav === 'sidenav' ? 'notAuthorizedComSideNav' : 'notAuthorized'}`}>
            <h2 className="mt-3"> Acesso negado</h2>
            <span>Você não tem permissão para acessar esta página. </span>
          </div>
        )}
      </div>
    </>
  )
}

export default NotAuhorizedUser
