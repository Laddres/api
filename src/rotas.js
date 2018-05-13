import { Router as routerFactory } from 'express';

import candidatos from './candidatos';

const router = routerFactory();

router.get('/', (req, res) => {
  res.status(200).send({
    success: { message: 'Bem-vindo ao Laddres' },
  });
});

router.get('/candidatos', (req, res) => {
  const parametros = {
    nomeCandidato: req.query.nome,
    tipo: req.query.tipo,
  };

  candidatos(parametros)
    .then(dados => res.status(200).send(dados))
    .catch((erro) => {
      const { statusCode } = erro;
      res.status(statusCode).send(erro);
    });
});

export default router;
