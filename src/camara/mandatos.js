/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'

import participacaoOrgaos from './participacao-orgaos'

const sqlMandatos = idDeputado => `
  SELECT
    camara_legislatura.id,
    camara_legislatura.data_inicio,
    camara_legislatura.data_fim
  FROM
    camara_mandato
    INNER JOIN camara_legislatura ON camara_mandato.camara_legislatura_id = camara_legislatura.id
  WHERE
    camara_mandato.deputado_id = ${idDeputado}
`

const formatarData = data => (
  data.toISOString().split('T')[0].split('-').reverse().toString().replace(/,/g, '/')
)
const formatarMandatos = mandatos => (
  mandatos.map(mandato => (
    {
      idLegislatura: mandato.id,
      dataInicio: formatarData(mandato.data_inicio),
      dataFim: formatarData(mandato.data_fim),
    }
  ))
)

const mandatos = ({ idDeputado }) => (
  new Promise((resolve, reject) => {
    const sql = sqlMandatos(idDeputado)

    db.query(sql)
      .then((resultados) => {
        const listaMandatos = formatarMandatos(resultados)
        // resolve(listaMandatos)
        Promise.all(listaMandatos.map(mandato => (
          participacaoOrgaos({ idDeputado, idLegislatura: mandato.idLegislatura })
        )))
          .then((participacoes) => {
            resolve(listaMandatos.map((mandato, indice) => (
              {
                ...mandato,
                participacaoOrgaos: participacoes[indice],
              }
            )))
          })
          .catch(erroParticipacoes => (
            reject({ statusCode: 500, erro: `Erro inesperado: ${erroParticipacoes}` })
          ))
      })
      .catch(error => reject({ statusCode: 500, erro: `Erro inesperado: ${error}` }))
  })
)

export default mandatos
