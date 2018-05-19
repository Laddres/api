import { Router as routerFactory } from 'express'

import candidatos from './candidatos'
import candidaturas from './candidaturas'

const router = routerFactory()

router.get('/', (req, res) => {
  res.status(200).send({
    success: { message: 'Bem-vindo ao Laddres' },
  })
})

router.get('/candidatos', (req, res) => {
  const parametros = {
    nomeCandidato: req.query.nome,
    tipo: req.query.tipo,
    pagina: req.query.pagina,
    itens: req.query.itens,
  }

  candidatos(parametros)
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos/:id/candidaturas', (req, res) => {
  const parametros = {
    idCandidato: req.params.id,
  }

  candidaturas(parametros)
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

export default router
