import { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import { DadosContext } from '../../contexts/DadosContext'

interface ModalAdicionaProprietarioProps {
  readonly textbutton: string
  readonly textbutton2: string
  readonly show: boolean
  readonly onHide: () => void
}

function ModalAdicionaProprietario({ textbutton, textbutton2, show, onHide, ...rest }: ModalAdicionaProprietarioProps) {
  const {
    Proprietarios,
    idProprietarioSelecionado,
    setIdProprietarioSelecionado,
    proprietariosSelecionados,
    setProprietariosSelecionados,
    setIdProprietarioAtual
  } = useContext(DadosContext)

  const proprietariosFiltrados = Proprietarios.filter(
    (proprietario) => !proprietariosSelecionados.includes(proprietario.id)
  )

  const OptionsProprietarios = proprietariosFiltrados.map((dado) => ({
    value: dado.id,
    label: `${dado.nome} - CPF: ${dado.cpF_CNPJ}`
  }))

  // console.log(idProprietarioSelecionado)

  function salvaProprietario(e) {
    e.preventDefault()
    if (idProprietarioSelecionado !== 0) {
      setProprietariosSelecionados([...proprietariosSelecionados, idProprietarioSelecionado])
    }
    onHide()
  }

  return (
    <Modal
      {...rest}
      show={show}
      dialogClassName="modalMedio"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="headerModalEdit">
          <h4>Adicionar proprietário</h4>
        </div>

        <div className="bodyModalEdit">
          <form className="formEdicaoAgente">
            <div className="editaAgente">
              <div className="labelForm col-11 col-md-12 mb-4">
                <Select
                  className=" selectTipoInfracao col-12"
                  name="selectProprietario"
                  id="selectAdicionaCondutorProprietario"
                  placeholder="Selecionar proprietário"
                  options={OptionsProprietarios}
                  onChange={(e) => setIdProprietarioSelecionado(e.value)}
                  required
                />
              </div>
            </div>

            <div className="buttonsModalEdit">
              {/* <ButtonSubmit text={'Salvar'} onClick={handleSubmit(formAtualizaAgente)}></ButtonSubmit> */}
              <Button type="submit" onClick={salvaProprietario} variant="none" className="buttonSave">
                {textbutton}
              </Button>
              <Button onClick={onHide} variant="none" className="buttonCancel">
                {textbutton2}
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ModalAdicionaProprietario
