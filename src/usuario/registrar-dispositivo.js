/* eslint-disable prefer-promise-reject-errors */
import jwt from 'jsonwebtoken'

import db from '../utils/database'

const sqlConsulta = uniqueId => `
  SELECT
    id,
    user_agent
  FROM
    usuario
  WHERE
    usuario.id = "${uniqueId}";`
const sqlCadastro = (uniqueId, userAgent) => `
  INSERT INTO
    usuario (id, user_agent)
  VALUES
    ("${uniqueId}", "${userAgent}");`

const registrarDispositivo = ({ uniqueId, userAgent }) => (
  new Promise((resolve, reject) => {
    if (!uniqueId) {
      reject({
        statusCode: 400,
        erro: 'Verifique se os parâmetros de sua requisição estão de acordo com a documentação do projeto',
      })
    }

    if (!userAgent.match(/(android|iphone|mobile)/i)) {
      reject({
        statusCode: 403,
        erro: 'Tipo de dispositivo inválido',
      })
    }

    const token = jwt.sign(
      { id: uniqueId },
      process.env.JWT_SECRET,
      { expiresIn: 5184000 },
    )

    db.query(sqlConsulta(uniqueId))
      .then((resultados) => {
        if (resultados.length > 0) {
          resolve(token)
        }

        db.query(sqlCadastro(uniqueId, userAgent))
          .then(() => resolve(token))
          .catch((error) => {
            reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
          })
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default registrarDispositivo
