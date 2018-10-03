import busca from './busca'
import porCargo from './por-cargo'
import porId from './por-id'

const candidato = ({
  idCandidato,
  nomeCandidato,
  siglaEstado,
  genero,
  corRaca,
  idDispositivo,
}) => {
  if (idCandidato) {
    return porId({ idCandidato })
  }

  if (!nomeCandidato) {
    return porCargo({
      siglaEstado,
      genero,
      corRaca,
      idDispositivo,
    })
  }

  return busca({
    nomeCandidato,
    siglaEstado,
    genero,
    corRaca,
    idDispositivo,
  })
}

export default candidato
