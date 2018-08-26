/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'

const sql = idCandidato => `
  SELECT
    id_candidato,
    numero_partidos,
    partidos_anteriores,
    numero_candidaturas,
    numero_mandatos,
    numero_proposicoes,
    numero_projetos
  FROM
    hot_resumo_candidato
  WHERE
    id_candidato = ${idCandidato};`

const formatarRetorno = (info) => {
  const partidos = info.partidos_anteriores.split(' - ')
  const [atual, ...anteriores] = [...partidos].reverse()

  return {
    idCandidato: info.id_candidato,
    numeroPartidos: info.numero_partidos,
    partidoAtual: atual,
    partidosAnteriores: [...anteriores].reverse(),
    numeroProcessosJudiciais: null,
    numeroCandidaturas: info.numero_candidaturas,
    numeroMandatos: info.numero_mandatos,
    numeroProposicoes: info.numero_proposicoes,
    numeroProjetos: info.numero_projetos,
  }
}

const resumo = ({ idCandidato }) => (
  new Promise((resolve, reject) => {
    db.query(sql(idCandidato))
      .then((resultados) => {
        if (resultados.length === 0) {
          reject({ statusCode: 404, erro: 'Não foi possível encontrar o resumo deste candidato' })
        }

        resolve(formatarRetorno(resultados[0]))
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default resumo
