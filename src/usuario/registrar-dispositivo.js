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

const registrarDispositivo = ({ uniqueId, secret, userAgent }) => (
  new Promise((resolve, reject) => {
    if (!uniqueId || !secret || secret !== process.env.APP_SECRET) {
      reject({
        statusCode: 400,
        erro: 'Verifique se os parâmetros de sua requisição estão de acordo com a documentação do projeto',
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
