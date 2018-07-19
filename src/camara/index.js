/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'

import mandatos from './mandatos'

const sqlDeputado = idCandidato => `
  SELECT
    deputado.id,
    deputado.gabinete_predio,
    deputado.gabinete_sala,
    deputado.gabinete_telefone,
    deputado.gabinete_email,
    deputado.website
  FROM
    deputado
  WHERE
    candidato_id = ${idCandidato}
`

const formatarDeputado = deputado => ({
  idDeputado: deputado.id,
  foto: `https://www.camara.leg.br/internet/deputado/bandep/${deputado.id}.jpg`,
  gabinete: {
    predio: deputado.gabinete_predio,
    sala: deputado.gabinete_sala ? parseInt(deputado.gabinete_sala, 10) : null,
    telefone: deputado.gabinete_telefone,
    email: deputado.gabinete_email,
  },
  website: deputado.website,
})

const camara = ({ idCandidato }) => (
  new Promise((resolve, reject) => {
    const sql = sqlDeputado(idCandidato)

    db.query(sql)
      .then((resultados) => {
        if (resultados.length === 0) {
          resolve({})
        }

        const deputado = formatarDeputado(resultados[0])
        mandatos({ idDeputado: deputado.idDeputado })
          .then(resultadoMandatos => (
            resolve({
              ...deputado,
              mandatos: resultadoMandatos,
            })
          ))
          .catch(erroMandatos => (
            reject({ statusCode: 500, erro: `Erro inesperado: ${erroMandatos}` })
          ))
      })
      .catch(error => reject({ statusCode: 500, erro: `Erro inesperado: ${error}` }))
  })
)

export default camara
