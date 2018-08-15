/* eslint-disable prefer-promise-reject-errors */
import camara from './camara'

const mandatos = ({ idCandidato, anoEleicao, cargo }) => {
  if (!anoEleicao) {
    return Promise.reject({
      statusCode: 400,
      erro: 'É preciso enviar o ano da eleição em que o candidato foi eleito',
    })
  }
  if (!cargo) {
    return Promise.reject({
      statusCode: 400,
      erro: 'É preciso enviar o cargo que o candidato exerceu durante este mandato',
    })
  }

  const funcao = cargo.toLowerCase

  if (funcao === 'deputado federal') {
    return camara({ idCandidato, anoEleicao })
  }

  return Promise.reject({
    statusCode: 404,
    erro: 'Não encontramos nenhum mandato para os parâmetros indicados',
  })
}

export default mandatos
