import busca from './busca'
import porCargo from './por-cargo'
import porId from './por-id'

const candidato = ({
  idCandidato,
  nomeCandidato,
  siglaEstado,
  genero,
  corRaca,
  primeiraCandidatura,
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
      primeiraCandidatura,
      idDispositivo,
    })
  }

  return busca({
    nomeCandidato,
    siglaEstado,
    genero,
    corRaca,
    primeiraCandidatura,
    idDispositivo,
  })
}

export default candidato
