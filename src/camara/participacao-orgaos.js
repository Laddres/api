/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'

const sqlParticipacoes = (idDeputado, idLegislatura) => `
  SELECT
    orgao.id,
    orgao.nome as orgao,
    papel.nome as papel,
    participacao.data_inicio,
    participacao.data_fim
  FROM
    camara_participacao_orgao participacao
    INNER JOIN camara_papel_orgao papel on participacao.camara_papel_orgao_id = papel.id
    INNER JOIN camara_orgao orgao on participacao.camara_orgao_id = orgao.id
  WHERE
    deputado_id = ${idDeputado} AND
    camara_legislatura_id = ${idLegislatura}
  ORDER BY
    participacao.data_inicio ASC
`

const formatarData = data => (
  data.toISOString().split('T')[0].split('-').reverse().toString().replace(/,/g, '/')
)
const formatarParticipacoes = participacoes => (
  participacoes.map(participacao => ({
    orgao: participacao.orgao,
    papel: participacao.papel,
    dataInicio: formatarData(participacao.data_inicio),
    dataFim: participacao.data_fim ? formatarData(participacao.data_fim) : null,
  }))
)

const participacaoOrgaos = ({ idDeputado, idLegislatura }) => (
  new Promise((resolve, reject) => {
    const sql = sqlParticipacoes(idDeputado, idLegislatura)

    db.query(sql)
      .then(resultados => resolve(formatarParticipacoes(resultados)))
      .catch(error => reject({ statusCode: 500, erro: `Erro inesperado: ${error}` }))
  })
)

export default participacaoOrgaos
