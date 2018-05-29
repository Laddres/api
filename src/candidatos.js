/* eslint-disable prefer-promise-reject-errors */
import capitalize from 'capitalize-pt-br'

import db from './utils/database'
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
const sqlExpandido = idCandidato => `
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
    candidato.id = ${idCandidato} AND
    cidade.id = candidato.cidade_id;`

const formatarData = data => (
  data.toISOString().split('T')[0].split('-').reverse().toString().replace(/,/g, '/')
)
const formatarCPF = cpf => cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
const formatarTitulo = titulo => titulo.replace(/(\d{4})(\d{4})(\d{4})/g, '$1 $2 $3')
const formatarCandidatoCompleto = candidato => ({
  id: candidato.id,
  nome: capitalize(candidato.nome),
  dataNascimento: candidato.data_nascimento ? formatarData(candidato.data_nascimento) : null,
  cpf: candidato.cpf ? formatarCPF(candidato.cpf) : null,
  tituloEleitoral: candidato.titulo_eleitoral ? formatarTitulo(candidato.titulo_eleitoral) : null,
  email: candidato.email ? candidato.email.toLowerCase() : null,
  cidadeNatal: candidato.cidade_natal ? capitalize(candidato.cidade_natal) : null,
  estadoOrigem: candidato.estado_origem ? capitalize(candidato.estado_origem) : null,
  grauInstrucao: candidato.grau_instrucao ? capitalize(candidato.grau_instrucao) : null,
  ocupacao: candidato.ocupacao ? capitalize(candidato.ocupacao) : null,
  nacionalidade: candidato.nacionalidade ? capitalize(candidato.nacionalidade) : null,
})
const formatarCandidatoResumido = candidato => ({
  id: candidato.id,
  nome: capitalize(candidato.nome),
  cidade: candidato.cidade ? capitalize(candidato.cidade) : null,
  estado: candidato.estado ? candidato.estado.toUpperCase() : null,
})
const formatarRetorno = (candidatos, tipoRetorno) => (
  tipoRetorno === 'resumido'
    ? candidatos.map(candidato => formatarCandidatoResumido(candidato))
    : candidatos.map(candidato => formatarCandidatoCompleto(candidato))
)

const candidatosPorNome = ({
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

    db.query(sql)
      .then((resultados) => {
        resolve(formatarRetorno(resultados, tipo))
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

const candidatosPorId = ({ idCandidato }) => (
  new Promise((resolve, reject) => {
    if (!idCandidato) {
      reject({ statusCode: 400, erro: 'É preciso enviar o nome de um candidato' })
    }

    const sql = sqlExpandido(parseInt(idCandidato, 10))

    db.query(sql)
      .then((resultados) => {
        if (resultados.length === 0) {
          resolve([])
        }

        const candidato = formatarCandidatoCompleto(resultados[0])
        candidaturas({ idCandidato: candidato.id })
          .then(resultadoCandidaturas => (
            resolve({ ...candidato, candidaturas: resultadoCandidaturas })
          ))
          .catch(erroCandidaturas => (
            reject({ statusCode: 500, erro: `Erro inesperado: ${erroCandidaturas}` })
          ))
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

const candidatos = {
  porNome: candidatosPorNome,
  porId: candidatosPorId,
}

export default candidatos
