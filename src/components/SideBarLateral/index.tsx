import React, { useContext, useState } from 'react'

import './SideBarLateral.css'
import { BsFillGearFill, BsFillFileEarmarkTextFill, BsFillPenFill } from 'react-icons/bs'
import { FaTable, FaUserAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/AuthContext'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'

function SideBar() {
  const { classSideNav } = useContext(CondicionaisFormContext)
  const { Permissoes } = useContext(AuthContext)

  const [dropdownConfig, setDropdownConfig] = useState(false)
  const [dropdownNotificacoes, setDropdownNotificacoes] = useState(false)

  function openDropdownConfig() {
    setDropdownConfig(!dropdownConfig)
  }

  function openDropdownNotificacoes() {
    setDropdownNotificacoes(!dropdownNotificacoes)
  }

  return (
    <div className={classSideNav}>
      <div>
        <div className="sidenav-menu">
          <ul>
            {Permissoes.toString() === 'Administrador' && (
              <>
                <Link to="/digitalizacao">
                  <li>
                    <div className="itemMenuLista mt-2">
                      <BsFillPenFill className="iconItemMenu" size={14} />
                      Digitação
                    </div>
                  </li>
                </Link>

                <li>
                  <div className="itemMenuLista" onClick={openDropdownConfig}>
                    <BsFillGearFill className="iconItemMenu" size={14} />
                    Configurações
                  </div>
                  {dropdownConfig && (
                    <div className="itensDropdown">
                      <ul>
                        <Link to="/configuracoesAgente">
                          <li className="subItemDropdown" onClick={() => setDropdownConfig(false)}>
                            Agentes
                          </li>
                        </Link>

                        <Link to="/configuracoesUsuario">
                          <li className="subItemDropdown" onClick={() => setDropdownConfig(false)}>
                            Usuários
                          </li>
                        </Link>

                        <Link to="/configuracoesCorporacao">
                          <li className="subItemDropdown" onClick={() => setDropdownConfig(false)}>
                            Corporações
                          </li>
                        </Link>

                        <Link to="/configuracoesCondutores">
                          <li className="subItemDropdown" onClick={() => setDropdownConfig(false)}>
                            Condutores
                          </li>
                        </Link>

                        <Link to="/configuracoesProprietarios">
                          <li className="subItemDropdown" onClick={() => setDropdownConfig(false)}>
                            Proprietários
                          </li>
                        </Link>
                      </ul>
                    </div>
                  )}
                </li>

                <Link to="/controlePermissionarios">
                  <li>
                    <div className="itemMenuLista">
                      <FaUserAlt className="iconItemMenu" size={14} />
                      Permissionários
                    </div>
                  </li>
                </Link>

                <li>
                  <div className="itemMenuLista" onClick={openDropdownNotificacoes}>
                    <BsFillFileEarmarkTextFill className="iconItemMenu" size={14} />
                    Notificações
                  </div>

                  {dropdownNotificacoes && (
                    <div className="itensDropdown">
                      <ul>
                        <Link to="/geracaoDeLote">
                          <li className="subItemDropdown" onClick={() => setDropdownNotificacoes(false)}>
                            Gerar lote
                          </li>
                        </Link>

                        <Link to="/controleDeLotes">
                          <li className="subItemDropdown" onClick={() => setDropdownNotificacoes(false)}>
                            Controle de lotes
                          </li>
                        </Link>
                      </ul>
                    </div>
                  )}
                </li>

                <Link to="/enquadramentos">
                  <li>
                    <div className="itemMenuLista">
                      <FaTable className="iconItemMenu" size={14} />
                      Enquadramentos
                    </div>
                  </li>
                </Link>
              </>
            )}

            {/* <li>
                    <div className='itemMenuLista'>
                        <BsFillFileEarmarkTextFill className='iconItemMenu' size={14} />
                        Documentos
                    </div>
                </li> */}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SideBar
