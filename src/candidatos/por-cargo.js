/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'
import { nomeProprio } from '../utils/formatar'
import estados from '../utils/estados'

const sql = (idCargo, idEstado) => `
  SELECT
    id,
    nome_urna,
    partido,
    numero
  FROM
    hot_dados_candidato
  WHERE
    id_cargo = ${idCargo} AND
    (id_estado_candidatura = ${idEstado} OR id_estado_candidatura IS NULL);`

const formatarRetorno = candidatos => (
  candidatos.map(candidato => ({
    id: candidato.id,
    nome: nomeProprio(candidato.nome_urna),
    foto: 'http://divulgacandcontas.tse.jus.br/candidaturas/oficial/2018/BR/PI/2022802018/180000626508/foto_1534365971368.jpg',
    numero: candidato.numero,
    partido: candidato.partido,
  }))
)

const candidatosPorCargo = ({ siglaEstado = 'SE' }) => (
  new Promise((resolve, reject) => {
    const estado = estados[siglaEstado.toUpperCase()]

    Promise.all([
      db.query(sql(1, estado.id)), // Presidente
      db.query(sql(3, estado.id)), // Governador
      db.query(sql(5, estado.id)), // Senador
      db.query(sql(6, estado.id)), // Deputado Federal
      db.query(sql(7, estado.id)), // Deputado Estadual
    ])
      .then((resultados) => {
        const retorno = {
          presidente: formatarRetorno(resultados[0]),
          governador: formatarRetorno(resultados[1]),
          senador: formatarRetorno(resultados[2]),
          deputadoFederal: formatarRetorno(resultados[3]),
          deputadoEstadual: formatarRetorno(resultados[4]),
        }
        resolve(retorno)
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default candidatosPorCargo
