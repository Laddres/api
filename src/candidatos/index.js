import busca from './busca'
import porCargo from './por-cargo'
import porId from './por-id'

const candidato = ({
  idCandidato,
  nomeCandidato,
  siglaEstado,
  genero,
  corRaca,
}) => {
  if (idCandidato) {
    return porId({ idCandidato })
  }

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
