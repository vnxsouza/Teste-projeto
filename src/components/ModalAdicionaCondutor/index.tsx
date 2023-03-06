import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import { DadosContext } from '../../contexts/DadosContext'

interface ModalAdicionaCondutorProps {
  readonly textbutton: string
  readonly textbutton2: string
  readonly show: boolean
  readonly onHide: () => void
}

function ModalAdicionaCondutor({ textbutton, textbutton2, show, onHide, ...rest }: ModalAdicionaCondutorProps) {
  const {
    Condutores,
    idCondutorSelecionado,
    setIdCondutorSelecionado,
    condutoresSelecionados,
    setCondutoresSelecionados
  } = useContext(DadosContext)

  const condutoresFiltrados = Condutores.filter(
    (condutor) => !condutor.dataInativo && !condutoresSelecionados.includes(condutor.id)
  )

  const OptionsCondutores = condutoresFiltrados.map((dado) => ({
    value: dado.id,
    label: `${dado.codigo} - ${dado.nome}`
  }))

  // console.log(idCondutorSelecionado)

  function salvaCondutor(e) {
    e.preventDefault()
    if (idCondutorSelecionado !== 0) {
      setCondutoresSelecionados([...condutoresSelecionados, idCondutorSelecionado])
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
          <h4>Adicionar condutor</h4>
        </div>

        <div className="bodyModalEdit">
          <form className="formEdicaoAgente">
            <div className="editaAgente">
              <div className="labelForm col-11 col-md-12 mb-4">
                <Select
                  className=" selectTipoInfracao col-12"
                  name="selectCondutor"
                  id="selectAdicionaCondutorProprietario"
                  placeholder="Selecionar condutor"
                  options={OptionsCondutores}
                  onChange={(e) => setIdCondutorSelecionado(e.value)}
                  required
                />
              </div>
            </div>

            <div className="buttonsModalEdit">
              {/* <ButtonSubmit text={'Salvar'} onClick={handleSubmit(formAtualizaAgente)}></ButtonSubmit> */}
              <Button type="submit" onClick={salvaCondutor} variant="none" className="buttonSave">
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

export default ModalAdicionaCondutor
