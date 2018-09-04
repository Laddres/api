/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'

const sqlProcessado = idCandidato => `
  SELECT
    processado
  FROM
    hot_vigieaqui_politico_processado
  WHERE
    id_candidato = ${idCandidato};`
const sqlProcessos = idCandidato => `
  SELECT
    id_processo,
    numero,
    tipo,
    tribunal,
    descricao,
    link
  FROM
    hot_vigieaqui_processos
  WHERE
    id_candidato = ${idCandidato};`

const formatarRetorno = listaProcessos => ({
  processado: listaProcessos.length > 0,
  numeroProcessos: listaProcessos.length,
  processos: listaProcessos.map(processo => ({
    idProcesso: processo.id_processo,
    numero: processo.numero,
    tipo: processo.tipo,
    tribunal: processo.tribunal,
    descricao: processo.descricao,
    link: processo.link,
  })),
})

const processos = ({ idCandidato }) => (
  new Promise((resolve, reject) => {
    db.query(sqlProcessado(idCandidato))
      .then((resultados) => {
        if (resultados.length === 0) {
          resolve({ processado: null })
        }

        db.query(sqlProcessos(idCandidato))
          .then(listaProcessos => resolve(formatarRetorno(listaProcessos)))
          .catch(error => reject({ statusCode: 500, erro: `Erro inesperado: ${error}` }))
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default processos
