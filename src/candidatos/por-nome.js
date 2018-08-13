/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'
import * as formatar from '../utils/formatar'

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

const formatarCandidatoCompleto = candidato => ({
  id: candidato.id,
  nome: formatar.nomeProprio(candidato.nome),
  dataNascimento: formatar.data(candidato.data_nascimento),
  cpf: formatar.cpf(candidato.cpf),
  tituloEleitoral: formatar.tituloEleitoral(candidato.titulo_eleitoral),
  email: formatar.email(candidato.email),
  cidadeNatal: formatar.nomeProprio(candidato.cidade_natal),
  estadoOrigem: formatar.nomeProprio(candidato.estado_origem),
  grauInstrucao: formatar.nomeProprio(candidato.grau_instrucao),
  ocupacao: formatar.nomeProprio(candidato.ocupacao),
  nacionalidade: formatar.nomeProprio(candidato.nacionalidade),
})
const formatarCandidatoResumido = candidato => ({
  id: candidato.id,
  nome: formatar.nomeProprio(candidato.nome),
  cidade: formatar.nomeProprio(candidato.cidade),
  estado: candidato.estado ? candidato.estado.toUpperCase() : null,
})
const formatarRetorno = (candidatos, tipoRetorno) => {
  if (tipoRetorno === 'resumido') {
    return candidatos.map(candidato => formatarCandidatoResumido(candidato))
  }
  if (tipoRetorno === 'completo') {
    return candidatos.map(candidato => formatarCandidatoCompleto(candidato))
  }

  return []
}

const candidatosPorNome = ({
  nomeCandidato,
  tipo = 'resumido',
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

export default candidatosPorNome
