/* eslint-disable prefer-promise-reject-errors */
import db from '../utils/database'
import { data, idade, nomeProprio } from '../utils/formatar'

const sql = idCandidato => `
  SELECT
    id,
    nome,
    nome_urna,
    cpf,
    foto,
    data_nascimento,
    cidade_natal,
    estado_natal,
    partido,
    numero,
    cargo,
    grau_instrucao,
    ocupacao,
    genero,
    cor_raca
  FROM
    hot_dados_candidato
  WHERE
    id = ${idCandidato};`

const formatarRetorno = candidato => ({
  id: candidato.id,
  nome: nomeProprio(candidato.nome),
  nomeUrna: nomeProprio(candidato.nome_urna),
  cpf: candidato.cpf,
  foto: candidato.foto,
  dataNascimento: data(candidato.data_nascimento),
  idade: idade(candidato.data_nascimento),
  cidadeNatal: nomeProprio(candidato.cidade_natal),
  estadoNatal: nomeProprio(candidato.estado_natal),
  partido: candidato.partido,
  numero: candidato.numero,
  cargo: nomeProprio(candidato.cargo),
  grauInstrucao: nomeProprio(candidato.grau_instrucao),
  ocupacao: nomeProprio(candidato.ocupacao),
  genero: nomeProprio(candidato.genero),
  corRaca: nomeProprio(candidato.cor_raca),
})

const candidatosPorId = ({ idCandidato }) => (
  new Promise((resolve, reject) => {
    db.query(sql(idCandidato))
      .then((resultados) => {
        if (resultados.length === 0) {
          reject({ statusCode: 404, erro: 'Este candidato não existe' })
        }

        resolve(formatarRetorno(resultados[0]))
      })
      .catch((error) => {
        reject({ statusCode: 500, erro: `Erro inesperado: ${error}` })
      })
  })
)

export default candidatosPorId
