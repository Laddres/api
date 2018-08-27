/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'

const sql = (idCandidato, idDispositivo) => `
  INSERT INTO
    \`like\` (candidato_id, usuario_id)
  VALUES
    (${idCandidato}, '${idDispositivo}');`

const like = ({ idCandidato, idDispositivo }) => (
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
        if (error.code === 'ER_DUP_ENTRY') {
          resolve()
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
          reject({
            statusCode: 404,
            error: 'Verifique se os parâmetros indicados estão devidamente cadastrados',
          })
        }
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default like
