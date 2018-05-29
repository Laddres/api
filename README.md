# Laddres - Laboratório de Análise de Desempenho Dos REpresentantes da Sociedade

## API

 API pública para consulta dos dados armazenados no banco de dados do projeto. Responsável, principalmente, por fornecer os dados que serão exibidos no website e no aplicativo móvel.

## Docs (temporário)

- `/api/candidatos?nome={nome do candidato}&pagina={número da página}&itens{número de itens por página}`
  Retorna todas informações sobre um candidato

- `/api/candidatos?nome={nome do candidato}&tipo=resumido&pagina={número da página}&itens{número de itens por página}`
  Retorna somente o nome e a origem do candidato

- `/api/candidatos/{id}`
  Retorna todas as informações sobre um candidato, incluindo todas as candidaturas

- `/api/candidatos/{id}/candidaturas`
  Retorna todas as candidatuas a partir do id de um candidato

### Exemplo de retorno completo

```
{
  "id": 412004,
  "nome": "João Alves Filho",
  "dataNascimento": "03/07/1941",
  "cpf": "002.588.495-68",
  "tituloEleitoral": "0006 3133 2178",
  "email": "jaf.sergipe@gmail.com",
  "cidadeNatal": "Aracaju",
  "estadoOrigem": "Sergipe",
  "grauInstrucao": "Superior Completo",
  "ocupacao": "Engenheiro",
  "nacionalidade": "Brasileira Nata",
  "candidaturas": [
    {
      "id": 418826,
      "anoEleicao": 2006,
      "descricaoEleicao": "Eleicoes 2006",
      "cidade": null,
      "estado": "Sergipe",
      "numeroCandidato": 25,
      "nomeUrna": "João Alves",
      "siglaPartido": "DEM",
      "nomePartido": "Democratas",
      "nomeLegenda": "Sergipe no Rumo Certo",
      "composicaoLegenda": null,
      "cargo": "Governador",
      "despesaMaxima": 4000000,
      "situacaoCandidatura": "Deferido",
      "resultadoCandidatura": "Não Eleito"
    },
    {
      "id": 825797,
      "anoEleicao": 2010,
      "descricaoEleicao": "Eleições 2010",
      "cidade": null,
      "estado": "Sergipe",
      "numeroCandidato": 25,
      "nomeUrna": "João Alves",
      "siglaPartido": "DEM",
      "nomePartido": "Democratas",
      "nomeLegenda": "Em Nome do Povo",
      "composicaoLegenda": null,
      "cargo": "Governador",
      "despesaMaxima": 10000000,
      "situacaoCandidatura": "Deferido",
      "resultadoCandidatura": "Não Eleito"
    },
    {
      "id": 1219607,
      "anoEleicao": 2012,
      "descricaoEleicao": "Eleição Municipal 2012",
      "cidade": "Aracaju",
      "estado": "Sergipe",
      "numeroCandidato": 25,
      "nomeUrna": "João Alves",
      "siglaPartido": "DEM",
      "nomePartido": "Democratas",
      "nomeLegenda": "Aracaju Não Pode Esperar",
      "composicaoLegenda": "PP / PTB / PSL / PTN / PSC / PR / DEM / PRTB / PMN / PTC / PRP / PSDB / PPL",
      "cargo": "Prefeito",
      "despesaMaxima": 12000000,
      "situacaoCandidatura": "Deferido",
      "resultadoCandidatura": "Eleito"
    },
    {
      "id": 1742391,
      "anoEleicao": 2016,
      "descricaoEleicao": "Eleições Municipais 2016",
      "cidade": "Aracaju",
      "estado": "Sergipe",
      "numeroCandidato": 25,
      "nomeUrna": "João Alves",
      "siglaPartido": "DEM",
      "nomePartido": "Democratas",
      "nomeLegenda": "Aracaju em Boas Mãos",
      "composicaoLegenda": "DEM / PSDB / PV / PPS / PEN / PHS",
      "cargo": "Prefeito",
      "despesaMaxima": null,
      "situacaoCandidatura": "Deferido",
      "resultadoCandidatura": "Não Eleito"
    }
  ]
}
```
