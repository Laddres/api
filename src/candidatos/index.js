import busca from './busca'
import porCargo from './por-cargo'
// import porId from './por-id'
// import porNome from './por-nome'

const candidato = ({ nomeCandidato, siglaEstado }) => {
  if (!nomeCandidato) {
    return porCargo({ siglaEstado })
  }
  return busca({ nomeCandidato, siglaEstado })
}

export default candidato
