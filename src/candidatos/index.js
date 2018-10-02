import busca from './busca'
import porCargo from './por-cargo'

const candidato = ({
  nomeCandidato,
  siglaEstado,
  genero,
  corRaca,
}) => {
  if (!nomeCandidato) {
    return porCargo({ siglaEstado, genero, corRaca })
  }

  return busca({
    nomeCandidato,
    siglaEstado,
    genero,
    corRaca,
  })
}

export default candidato
