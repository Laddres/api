/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'

const sql = (idCandidato, idDispositivo) => `
  DELETE FROM
    \`like\`
  WHERE
    candidato_id = ${idCandidato} AND
    usuario_id = '${idDispositivo}';`

const dislike = ({ idCandidato, idDispositivo }) => (
  new Promise((resolve, reject) => {
    if (!idCandidato || !idDispositivo) {
      reject({
        statusCode: 400,
        erro: 'Verifique se os parâmetros de sua requisição estão de acordo com a documentação do projeto',
      })
    }

    db.query(sql(idCandidato, idDispositivo))
      .then(() => resolve())
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default dislike
