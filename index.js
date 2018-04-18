#!/usr/bin/env nodejs
const mysql = require('mysql');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const nomeCandidato = req.query.candidato;

  if (!nomeCandidato) {
    res.status(400).send('É preciso enviar o nome de um candidato para que a busca funcione corretamente');
    return;
  }

  const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'laddres',
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
      candidato.nome LIKE '%${termoBusca}%'
    ORDER BY
      candidato.id ASC
    LIMIT 10;`;
  conn.query(sqlCandidato, (error, results, fields) => {
    if (error) {
      res.status(500).send(error);
      return;
    }

    const candidato = results[0];
    if (!candidato) {
      res.status(404).send('Candidato não encontrado');
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
    conn.query(sqlCandidatura, (error, results, fields) => {
      if (error) {
        res.status(500).send(error);
        return;
      }

      candidato.candidaturas = results;
      res.status(200).send(candidato);
    })
  })
});

app.listen(3000, () => {
  console.log('Laddres is listening on por 3000!');
})
