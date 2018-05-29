/* eslint-disable prefer-promise-reject-errors */
import capitalize from 'capitalize-pt-br'

import db from './utils/database'

const sqlCompleto = (idCandidato, pagina, itens) => `
  SELECT
    candidatura.id,
    eleicao.ano as ano_eleicao,
    eleicao.descricao as descricao_eleicao,
    cidade.nome as cidade,
    estado.nome as estado,
    candidatura.numero_candidato,
    candidatura.nome_urna,
    partido.sigla as sigla_partido,
    partido.nome as nome_partido,
    candidatura.legenda_nome,
    candidatura.legenda_composicao,
    cargo.nome as cargo,
    candidatura.despesa_maxima,
    situacao_candidatura.descricao as situacao_candidatura,
    resultado_candidatura.descricao as resultado_candidatura
  FROM
    candidatura
      INNER JOIN candidato ON candidatura.candidato_id = candidato.id
      LEFT JOIN eleicao ON candidatura.eleicao_id = eleicao.id
      LEFT JOIN cidade ON candidatura.cidade_id = cidade.id
      LEFT JOIN estado ON candidatura.estado_id = estado.id
      LEFT JOIN partido ON candidatura.partido_id = partido.id
      LEFT JOIN cargo ON candidatura.cargo_id = cargo.id
      LEFT JOIN situacao_candidatura ON candidatura.situacao_candidatura_id = situacao_candidatura.id
      LEFT JOIN resultado_candidatura ON candidatura.resultado_candidatura_id = resultado_candidatura.id
  WHERE
    candidato.id = '${idCandidato}'
  ORDER BY
    eleicao.ano ASC
  LIMIT ${(pagina - 1) * itens}, ${itens}`

const formatarCandidaturas = candidaturas => (
  candidaturas.map(candidatura => (
    {
      id: candidatura.id,
      anoEleicao: candidatura.ano_eleicao,
      descricaoEleicao: capitalize(candidatura.descricao_eleicao),
      cidade: candidatura.cidade ? capitalize(candidatura.cidade) : null,
      estado: candidatura.estado ? capitalize(candidatura.estado) : null,
      numeroCandidato: candidatura.numero_candidato ? candidatura.numero_candidato : null,
      nomeUrna: candidatura.nome_urna ? capitalize(candidatura.nome_urna) : null,
      siglaPartido: candidatura.sigla_partido ? candidatura.sigla_partido.toUpperCase() : null,
      nomePartido: candidatura.nome_partido ? capitalize(candidatura.nome_partido) : null,
      nomeLegenda: candidatura.legenda_nome ? capitalize(candidatura.legenda_nome) : null,
      composicaoLegenda: candidatura.legenda_composicao
        ? candidatura.legenda_composicao.toUpperCase()
        : null,
      cargo: candidatura.cargo ? capitalize(candidatura.cargo) : null,
      despesaMaxima: candidatura.despesa_maxima ? candidatura.despesa_maxima : null,
      situacaoCandidatura: candidatura.situacao_candidatura
        ? capitalize(candidatura.situacao_candidatura)
        : null,
      resultadoCandidatura: candidatura.resultado_candidatura
        ? capitalize(candidatura.resultado_candidatura)
        : null,
    }
  ))
)

const candidaturas = ({ idCandidato, pagina = 1, itens = 100 }) => (
  new Promise((resolve, reject) => {
    const sql = sqlCompleto(idCandidato, pagina, itens)

    db.query(sql)
      .then((resultados) => {
        resolve(formatarCandidaturas(resultados))
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default candidaturas
