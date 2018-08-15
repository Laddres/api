/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'
import legislaturas from '../utils/camara-legislaturas'

const sqlProjetos = (idCandidato, inicioMandato, fimMandato) => `
  SELECT
    id_proposicao,
    id_candidato,
    sigla,
    numero,
    ano,
    ementa,
    keywords,
    url
  FROM
    hot_camara_atuacao_projetos
  WHERE
    id_candidato = ${idCandidato} AND
    ano BETWEEN ${inicioMandato} AND ${fimMandato}
  ORDER BY
    ano DESC,
    numero DESC;`
const sqlNumeroProposicoes = (idCandidato, idLegislatura) => `
  SELECT
    id_candidato,
    id_legislatura,
    numero_proposicoes
  FROM
    hot_camara_atuacao_numero_proposicoes
  WHERE
    id_candidato = ${idCandidato} AND
    id_legislatura = ${idLegislatura};`
// const sqlComissoesComoTitular
// const sqlNumeroComissoes

const formatarRetornoProjetos = projetos => (
  projetos.map(projeto => ({
    id: projeto.id_proposicao,
    sigla: projeto.sigla,
    numero: projeto.numero,
    ano: projeto.ano,
    ementa: projeto.ementa,
    keywords: projeto.keywords,
    url: projeto.url,
  }))
)

const camara = ({ idCandidato, anoEleicao }) => (
  new Promise((resolve, reject) => {
    const inicioMandato = +anoEleicao + 1
    const fimMandato = +anoEleicao + 4
    const idLegislatura = legislaturas[inicioMandato]

    Promise.all([
      db.query(sqlProjetos(idCandidato, inicioMandato, fimMandato)),
      db.query(sqlNumeroProposicoes(idCandidato, idLegislatura)),
    ])
      .then((resultados) => {
        const retorno = {
          projetos: formatarRetornoProjetos(resultados[0]),
          totalProjetos: resultados[0].length,
          totalProposicoes: resultados[1][0].numero_proposicoes,
        }
        resolve(retorno)
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default camara
