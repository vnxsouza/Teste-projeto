import './header.css'
import React, { useContext, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { AiOutlineMenu } from 'react-icons/ai'
import { BsFillPenFill, BsFillGearFill, BsFillFileEarmarkTextFill } from 'react-icons/bs'
import { CgProfile } from 'react-icons/cg'
import { FaTable } from 'react-icons/fa'
import { MdPerson, MdLogout } from 'react-icons/md'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/AuthContext'
import { CondicionaisFormContext } from '../../contexts/CondicionaisFormContext'

interface HeaderProps {
  readonly pageTitle?: string
  readonly className?: string
}

function Header({ pageTitle, className }: HeaderProps) {
  const { logout, Permissoes, clienteCode } = useContext(AuthContext)
  const { classSideNav, closeMenuLateral, openMenuLateral } = useContext(CondicionaisFormContext)

  const [menuMobile, setMenuMobile] = useState(false)

  function logoutUser() {
    logout()
  }

  const [profileActive, setProfileActive] = useState(false)

  function activeProfile() {
    setProfileActive(!profileActive)
  }

  function activeMenuMobile() {
    setMenuMobile(!menuMobile)
  }

  const [dropdownConfig, setDropdownConfig] = useState(false)

  function openDropdownConfig() {
    setDropdownConfig(!dropdownConfig)
  }

  const [dropdownNotificacoes, setDropdownNotificacoes] = useState(false)

  function openDropdownNotificacoes() {
    setDropdownNotificacoes(!dropdownNotificacoes)
  }

  return (
    <>
      <div className="header">
        <Navbar bg="none" expand="md" className="menu container">
          <Container fluid>
            <div className="img-menu col-1">
              <img src={`/imgs/brasao/${clienteCode}.png`} alt="Guarulhos" className="img-principal" />
            </div>
            {/* <Nav className="itens-menu flex-grow-1 pe-3">
              <Link to="/digitalizacao">
                <li>
                  <span>Digitação</span>
                </li>
              </Link>

              <Link to="/controlePermissionarios">
                <li>
                  <span>Permissionários</span>
                </li>
              </Link>
            </Nav> */}

            <div className="buttonProfile col-1">
              <CgProfile onClick={activeProfile} size={35} color="white" className="profile" />

              {profileActive && (
                <div className="profileActive mt-1" onClick={activeProfile} onMouseLeave={activeProfile}>
                  <Link to="/perfil">
                    <div className="itensPerfil mt-1 mb-1">
                      <MdPerson color="white" size={22} />
                      <span className="textItemPerfil">Meu perfil</span>
                    </div>
                  </Link>

                  <Link to="/">
                    <div className="itensPerfil mt-1 mb-1" onClick={logoutUser}>
                      <MdLogout color="white" size={22} />
                      <span className="textItemPerfil">Sair</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <div className="mobile">
              <AiOutlineMenu color="white" size={30} onClick={activeMenuMobile} className="buttonMenuSecundario" />

              {menuMobile && (
                <Offcanvas show onHide={activeMenuMobile} placement="end" className="menuMobile">
                  <Offcanvas.Header closeButton />

                  <Offcanvas.Body className="bodyOffCanvas">
                    <div className="itensMobile">
                      <ul>
                        <Link to="/digitalizacao">
                          <li onClick={() => activeMenuMobile}>
                            <BsFillPenFill size={20} className="iconMenuMobile" />
                            <span>Digitação</span>
                          </li>
                          <hr />
                        </Link>

                        {Permissoes.toString() === 'Administrador' && (
                          <>
                            <li>
                              <BsFillGearFill className="iconMenuMobile" size={20} />

                              <span onClick={openDropdownConfig}>Configurações</span>

                              {dropdownConfig && (
                                <div className="itensDropdownMobile">
                                  <ul>
                                    <Link to="/configuracoesAgente">
                                      <li
                                        className="subItemDropdown"
                                        onClick={() => [setDropdownConfig(false), setMenuMobile(false)]}
                                      >
                                        Agentes
                                      </li>
                                    </Link>

                                    <Link to="/configuracoesUsuario">
                                      <li
                                        className="subItemDropdown"
                                        onClick={() => [setDropdownConfig(false), setMenuMobile(false)]}
                                      >
                                        Usuários
                                      </li>
                                    </Link>

                                    <Link to="/configuracoesCorporacao">
                                      <li
                                        className="subItemDropdown"
                                        onClick={() => [setDropdownConfig(false), setMenuMobile(false)]}
                                      >
                                        Corporações
                                      </li>
                                    </Link>
                                  </ul>
                                </div>
                              )}
                            </li>

                            <hr />

                            <li>
                              <BsFillFileEarmarkTextFill className="iconMenuMobile" size={20} />

                              <span onClick={openDropdownNotificacoes}>Notificações</span>

                              {dropdownNotificacoes && (
                                <div className="itensDropdownMobile">
                                  <ul>
                                    <Link to="/geracaoDeLote">
                                      <li
                                        className="subItemDropdown"
                                        onClick={() => [setDropdownNotificacoes(false), setMenuMobile(false)]}
                                      >
                                        Gerar lote
                                      </li>
                                    </Link>

                                    <Link to="/controleDeLotes">
                                      <li
                                        className="subItemDropdown"
                                        onClick={() => [setDropdownNotificacoes(false), setMenuMobile(false)]}
                                      >
                                        Controle de lotes
                                      </li>
                                    </Link>
                                  </ul>
                                </div>
                              )}
                            </li>

                            <hr />

                            <li>
                              <FaTable className="iconMenuMobile" size={20} />
                              <Link to="/enquadramentos">
                                <span onClick={() => setMenuMobile(false)}>Enquadramentos</span>
                              </Link>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </Offcanvas.Body>
                </Offcanvas>
              )}
            </div>
          </Container>
        </Navbar>
      </div>

      <div className="subHeader">
        <div className="buttonMenuLateral">
          {classSideNav === 'sidenav' ? (
            <AiOutlineMenu color="black" size={30} className="iconMenuLateral" onClick={closeMenuLateral} />
          ) : (
            <AiOutlineMenu color="black" size={30} className="iconMenuLateral" onClick={openMenuLateral} />
          )}
        </div>
      </div>
    </>
  )
}

export default Header
