/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'
import { nomeProprio } from '../utils/formatar'

const sql = idCandidato => `
  SELECT
    id,
    id_candidato,
    cargo,
    partido,
    eleicao_ano,
    eleicao_descricao,
    cidade,
    estado_sigla,
    estado_nome,
    legenda_nome,
    legenda_composicao,
    resultado
  FROM
    hot_candidaturas_candidato
  WHERE
    id_candidato = ${idCandidato}
  ORDER BY id DESC
`

const formatarRetorno = candidaturas => (
  candidaturas.map(candidatura => ({
    id: candidatura.id,
    idCandidato: candidatura.id_candidato,
    cargo: nomeProprio(candidatura.cargo),
    partido: candidatura.partido,
    anoEleicao: candidatura.eleicao_ano,
    descricaoEleicao: candidatura.eleicao_descricao.toUpperCase(),
    cidade: nomeProprio(candidatura.cidade),
    siglaEstado: candidatura.estado_sigla,
    estado: nomeProprio(candidatura.estado_nome),
    nomeLegenda: nomeProprio(candidatura.legenda_nome),
    composicaoLegenda: candidatura.legenda_composicao,
    resultado: nomeProprio(candidatura.resultado) || 'Eleito',
  }))
)

const candidaturas = ({ idCandidato }) => (
  new Promise((resolve, reject) => {
    db.query(sql(idCandidato))
      .then((resultados) => {
        resolve(formatarRetorno(resultados))
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default candidaturas
