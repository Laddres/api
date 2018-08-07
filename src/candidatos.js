/* eslint-disable prefer-promise-reject-errors */
import db from './utils/database'
import * as formatar from './utils/formatar'
import estados from './utils/estados'
import candidaturas from './candidaturas'
import camara from './camara'

const expressaoBusca = termoBusca => (
  termoBusca
    .split(' ')
    .reduce((acc, item) => `${acc}+${item}${item.length > 2 ? '*' : ''} `, '')
)

const sqlCargo = (idCargo, idEstado) => `
  SELECT
    candidatura.id,
    candidatura.candidato_id,
    candidatura.nome_urna,
    candidatura.numero_candidato,
    partido.sigla
  FROM
    candidatura
    INNER JOIN partido on candidatura.partido_id = partido.id
  WHERE
    candidatura.eleicao_id = 138 AND
    candidatura.situacao_candidatura_id = 2 AND
    candidatura.cargo_id = ${idCargo} AND
    (candidatura.estado_id = ${idEstado} OR candidatura.estado_id IS NULL)`
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

const formatarCandidatoPorCargo = candidato => ({
  idCandidatura: candidato.id,
  idCandidato: candidato.candidato_id,
  nome: formatar.nomeProprio(candidato.nome_urna),
  numero: candidato.numero_candidato,
  partido: candidato.sigla.toUpperCase(),
})
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
  if (tipoRetorno === 'porCargo') {
    return candidatos.map(candidato => formatarCandidatoPorCargo(candidato))
  }

  return []
}

const candidatosPorCargo = ({ siglaEstado = 'SE' }) => (
  new Promise((resolve, reject) => {
    const estado = estados[siglaEstado.toUpperCase()]

    Promise.all([
      db.query(sqlCargo(1, estado.id)), // Presidente
      db.query(sqlCargo(3, estado.id)), // Governador
      db.query(sqlCargo(5, estado.id)), // Senador
      db.query(sqlCargo(6, estado.id)), // Deputado Federal
      db.query(sqlCargo(7, estado.id)), // Deputado Estadual
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
        Promise.all([
          candidaturas({ idCandidato: candidato.id }),
          camara({ idCandidato: candidato.id }),
        ])
          .then(outrasInformacoes => (
            resolve({
              ...candidato,
              candidaturas: outrasInformacoes[0],
              mandatos: {
                camara: outrasInformacoes[1],
              },
            })
          ))
          .catch((erroOutrasInformacoes) => {
            reject({ statusCode: 500, erro: `Erro inesperado: ${erroOutrasInformacoes}` })
          })
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

const candidatos = {
  porCargo: candidatosPorCargo,
  porNome: candidatosPorNome,
  porId: candidatosPorId,
}

export default candidatos
