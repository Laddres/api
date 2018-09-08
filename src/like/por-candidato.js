/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'

const sql = (idCandidato, idUsuario) => `
  SELECT
    COUNT(candidato_id) as likes,
    COUNT(IF(usuario_id = '${idUsuario}', 1, NULL)) as curtidasUsuario
  FROM
    \`like\`
  WHERE
    candidato_id = ${idCandidato};`

const formatarRetorno = candidato => ({
  curtidas: candidato.likes,
  usuarioCurtiu: candidato.curtidasUsuario !== 0,
})

const likes = ({ idCandidato }) => (
  new Promise((resolve, reject) => {
    db.query(sql(idCandidato))
      .then((resultados) => {
        if (resultados.length === 0) {
          reject({ statusCode: 404, erro: 'Este candidato não existe' })
        }

        resolve(formatarRetorno(resultados[0]))
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default likes
