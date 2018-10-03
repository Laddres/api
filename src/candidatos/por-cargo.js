/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'
import { nomeProprio } from '../utils/formatar'
import estados from '../utils/estados'

const sql = (idCargo, idEstado, genero, corRaca, idDispositivo) => {
  const filtroGenero = genero ? `AND genero = '${genero}'` : ''
  const filtroCorRaca = corRaca ? `AND cor_raca = '${corRaca}'` : ''
  const filtroFavoritos = idDispositivo ? `AND \`like\`.usuario_id = '${idDispositivo}'` : ''
  const joinFavoritos = idDispositivo
    ? 'RIGHT JOIN `like` ON `like`.candidato_id = hot_dados_candidato.id'
    : ''

  return `
    SELECT
      id,
      nome_urna,
      foto,
      partido,
      numero
    FROM
      hot_dados_candidato
      ${joinFavoritos}
    WHERE
      id_cargo = ${idCargo} AND
      (id_estado_candidatura = ${idEstado} OR id_estado_candidatura IS NULL)
      ${filtroGenero}
      ${filtroCorRaca}
      ${filtroFavoritos}
    ORDER BY
      RAND();`
}

const formatarRetorno = candidatos => (
  candidatos.map(candidato => ({
    id: candidato.id,
    nome: nomeProprio(candidato.nome_urna),
    foto: candidato.foto,
    numero: candidato.numero,
    partido: candidato.partido,
  }))
)

const candidatosPorCargo = ({
  siglaEstado = 'SE',
  genero,
  corRaca,
  idDispositivo,
}) => (
  new Promise((resolve, reject) => {
    const estado = estados[siglaEstado.toUpperCase()]

    Promise.all([
      db.query(sql(1, estado.id, genero, corRaca, idDispositivo)), // Presidente
      db.query(sql(3, estado.id, genero, corRaca, idDispositivo)), // Governador
      db.query(sql(5, estado.id, genero, corRaca, idDispositivo)), // Senador
      db.query(sql(6, estado.id, genero, corRaca, idDispositivo)), // Deputado Federal
      db.query(sql(7, estado.id, genero, corRaca, idDispositivo)), // Deputado Estadual
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
