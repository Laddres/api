import { Router as routerFactory } from 'express'

import candidatos from './candidatos'
import { candidaturas } from './candidaturas'
import mandatos from './mandatos'

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
    siglaEstado: req.query.estado,
  }

  if (!parametros.nomeCandidato) {
    candidatos.porCargo({ siglaEstado: parametros.siglaEstado })
      .then(dados => res.status(200).send(dados))
      .catch((erro) => {
        const { statusCode } = erro
        res.status(statusCode).send(erro)
      })
    return
  }

  candidatos.busca({ nomeCandidato: parametros.nomeCandidato, siglaEstado: parametros.siglaEstado })
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos/:id', (req, res) => {
  const parametros = {
    idCandidato: req.params.id,
  }

  candidatos.porId(parametros)
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

  candidaturas({ idCandidato: parametros.idCandidato })
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

router.get('/candidatos/:id/mandatos', (req, res) => {
  const parametros = {
    idCandidato: req.params.id,
    anoEleicao: req.query.anoEleicao,
    cargo: req.query.cargo,
  }

  mandatos(parametros)
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro
      res.status(statusCode).send(erro)
    })
})

export default router
