import jwt from 'jsonwebtoken'

export const verificarToken = (req, res, next) => {
  const token = req.headers['x-access-token']

  if (!token) {
    res.status(401).send({
      statusCode: 401,
      erro: 'É preciso indicar um token de acesso válido para obter estas informações',
    })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({
        statusCode: 401,
        erro: 'Falha ao autenticar o token indicado',
      })
      return
    }

    req.idDispositivo = decoded.id
    next()
  })
}

export default verificarToken
