/* eslint-disable prefer-promise-reject-errors */

import mysql from 'mysql'

import candidaturas from './candidaturas'

const expressaoBusca = termoBusca => (
  termoBusca
    .split(' ')
    .reduce((acc, item) => `${acc}+${item}${item.length > 2 ? '*' : ''} `, '')
)

const sqlResumido = (termoBusca, pagina, itens) => `
  SELECT
    candidato.id,
    candidato.nome as nome,
    cidade.nome as cidade,
    estado.sigla as estado
  FROM
    candidato,
    cidade
      INNER JOIN estado on cidade.estado_id = estado.id
  WHERE
    cidade.id = candidato.cidade_id AND
    MATCH(candidato.nome) AGAINST ('${expressaoBusca(termoBusca)}' IN BOOLEAN MODE)
  LIMIT ${(pagina - 1) * itens}, ${itens};`
const sqlCompleto = (termoBusca, pagina, itens) => `
  SELECT
    candidato.id,
    candidato.nome as nome,
    candidato.data_nascimento,
    candidato.cpf,
    candidato.titulo_eleitoral,
    candidato.email,
    cidade.nome as cidade_natal,
    estado.nome as estado_origem,
    grau_instrucao.descricao as grau_instrucao,
    ocupacao.descricao as ocupacao,
    nacionalidade.nome as nacionalidade
  FROM
    candidato
      LEFT JOIN grau_instrucao on candidato.grau_instrucao_id = grau_instrucao.id
      LEFT JOIN ocupacao on candidato.ocupacao_id = ocupacao.id
      LEFT JOIN nacionalidade on candidato.nacionalidade_id = nacionalidade.id,
    cidade
      INNER JOIN estado on cidade.estado_id = estado.id
  WHERE
    cidade.id = candidato.cidade_id AND
    MATCH(candidato.nome) AGAINST ('${expressaoBusca(termoBusca)}' IN BOOLEAN MODE)
  ORDER BY
    candidato.id ASC
  LIMIT ${(pagina - 1) * itens}, ${itens};`

const candidatos = ({
  nomeCandidato,
  tipo,
  pagina = 1,
  itens = 100,
}) => (
  new Promise((resolve, reject) => {
    if (!nomeCandidato) {
      reject({ statusCode: 400, erro: 'É preciso enviar o nome de um candidato' })
    }

    const sql = tipo === 'resumido'
      ? sqlResumido(nomeCandidato, pagina, itens)
      : sqlCompleto(nomeCandidato, pagina, itens)

    const conn = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    })
    conn.query(sql, (erro, resultados) => {
      if (erro) {
        reject({ statusCode: 500, erro: `Erro inesperado: ${erro}` })
      }

      if (tipo !== 'expandido') {
        resolve(resultados)
      }

      const promises = resultados.map(candidato => candidaturas({ idCandidato: candidato.id }))
      Promise.all(promises)
        .then((resultadoCandidaturas) => {
          const resultadoExpandido = []
          resultados.forEach((candidato, index) => {
            resultadoExpandido.push({
              ...candidato,
              candidaturas: resultadoCandidaturas[index],
            })
          })
          resolve(resultadoExpandido)
        })
        .catch(erroCandidaturas => (
          reject({ statusCode: 500, erro: `Erro inesperado: ${erroCandidaturas}` })
        ))
    })
  })
)

export default candidatos
