/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'
import { nomeProprio } from '../utils/formatar'
import estados from '../utils/estados'

const sql = (idCargo, idEstado, termoBusca) => `
  SELECT
    id,
    nome_urna,
    partido,
    numero
  FROM
    hot_dados_candidato
  WHERE
    (nome_urna LIKE '%${termoBusca}%' OR nome LIKE '%${termoBusca}%') AND
    id_cargo = ${idCargo} AND
    (id_estado_candidatura = ${idEstado} OR id_estado_candidatura IS NULL);`

const formatarRetorno = candidatos => (
  candidatos.map(candidato => ({
    id: candidato.id,
    nome: nomeProprio(candidato.nome_urna),
    numero: candidato.numero,
    partido: candidato.partido,
  }))
)

const candidatosBusca = ({ nomeCandidato, siglaEstado = 'SE' }) => (
  new Promise((resolve, reject) => {
    const estado = estados[siglaEstado.toUpperCase()]

    Promise.all([
      db.query(sql(1, estado.id, nomeCandidato)), // Presidente
      db.query(sql(3, estado.id, nomeCandidato)), // Governador
      db.query(sql(5, estado.id, nomeCandidato)), // Senador
      db.query(sql(6, estado.id, nomeCandidato)), // Deputado Federal
      db.query(sql(7, estado.id, nomeCandidato)), // Deputado Estadual
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

export default candidatosBusca
