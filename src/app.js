import mysql from 'mysql';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  const nomeCandidato = req.query.candidato;

  if (!nomeCandidato) {
    res.status(400).send({
      error: {
        message: 'É preciso enviar o nome de um candidato',
      },
    });
    return;
  }

  const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  const termoBusca = nomeCandidato;
  const sqlCandidato = `
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
        -- LEFT JOIN cidade on candidato.cidade_id = cidade.id
        LEFT JOIN grau_instrucao on candidato.grau_instrucao_id = grau_instrucao.id
        LEFT JOIN ocupacao on candidato.ocupacao_id = ocupacao.id
        LEFT JOIN nacionalidade on candidato.nacionalidade_id = nacionalidade.id,
      cidade
        INNER JOIN estado on cidade.estado_id = estado.id
    WHERE
      cidade.id = candidato.cidade_id AND
      candidato.nome LIKE '${termoBusca}%'
    ORDER BY
      candidato.id ASC
    LIMIT 10;`;
  conn.query(sqlCandidato, (error, results) => {
    if (error) {
      res.status(500).send({
        error: {
          message: `Erro inesperado: ${error}`,
        },
      });
      return;
    }

    const candidato = results[0];
    if (!candidato) {
      res.status(404).send({
        error: {
          message: 'Candidato não encontrado',
        },
      });
      return;
    }

    const sqlCandidatura = `
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
        candidato.id = '${candidato.id}'
      ORDER BY
        eleicao.ano ASC
      LIMIT 10;`;
    conn.query(sqlCandidatura, (error2, results2) => {
      if (error2) {
        res.status(500).send({
          error2: {
            message: `Erro inesperado: ${error2}`,
          },
        });
        return;
      }

      candidato.candidaturas = results2;
      res.status(200).send(candidato);
    });
  });
});

export default app;
