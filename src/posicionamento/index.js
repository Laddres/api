/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'

const sql = idCandidato => `
  SELECT
    id_candidato,
    id_tema,
    titulo,
    descricao,
    id_categoria,
    categoria,
    id_posicao,
    posicao,
    fonte_informacao,
    sigla_projeto,
    numero_projeto,
    ano_projeto,
    referencia_1_id,
    referencia_1_titulo,
    referencia_1_url,
    referencia_2_id,
    referencia_2_titulo,
    referencia_2_url,
    referencia_3_id,
    referencia_3_titulo,
    referencia_3_url
  FROM
    hot_posicionamento_candidato
  WHERE
    id_candidato = ${idCandidato}
  ORDER BY
    id_categoria ASC,
    id_tema ASC;`

const formatarRetorno = posicionamentos => (
  posicionamentos.map(posicionamento => ({
    idCandidato: posicionamento.id_candidato,
    idTema: posicionamento.id_tema,
    titulo: posicionamento.titulo,
    descricao: posicionamento.descricao,
    categoria: posicionamento.categoria,

    projeto: {
      sigla: posicionamento.sigla_projeto,
      numero: posicionamento.numero_projeto,
      ano: posicionamento.ano_projeto,
    },

    posicao: posicionamento.posicao,
    fonteInformacao: posicionamento.fonte_informacao,

    referencias: [
      {
        id: posicionamento.referencia_1_id,
        titulo: posicionamento.referencia_1_titulo,
        url: posicionamento.referencia_1_url,
      },
      {
        id: posicionamento.referencia_2_id,
        titulo: posicionamento.referencia_2_titulo,
        url: posicionamento.referencia_2_url,
      },
      {
        id: posicionamento.referencia_3_id,
        titulo: posicionamento.referencia_3_titulo,
        url: posicionamento.referencia_3_url,
      },
    ],
  }))
)

const posicionamento = ({ idCandidato }) => (
  new Promise((resolve, reject) => {
    db.query(sql(idCandidato))
      .then((resultados) => {
        resolve(formatarRetorno(resultados))
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default posicionamento
