/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'
import { nomeProprio } from '../utils/formatar'
import estados from '../utils/estados'

const sql = (idCargo, idEstado) => `
  SELECT
    id,
    nomeUrna,
    partido,
    numero
  FROM
    eleicoes2014_dados_candidato
  WHERE
    idCargo = ${idCargo} AND
    (idEstadoCandidatura = ${idEstado} OR idEstadoCandidatura IS NULL);`

const formatarRetorno = candidatos => (
  candidatos.map(candidato => ({
    id: candidato.id,
    nome: nomeProprio(candidato.nomeUrna),
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
          presidente: formatarRetorno(resultados[0], 'porCargo'),
          governador: formatarRetorno(resultados[1], 'porCargo'),
          senador: formatarRetorno(resultados[2], 'porCargo'),
          deputadoFederal: formatarRetorno(resultados[3], 'porCargo'),
          deputadoEstadual: formatarRetorno(resultados[4], 'porCargo'),
        }
        resolve(retorno)
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default candidatosPorCargo
