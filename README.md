# Laddres - Laboratório de Análise de Desempenho Dos REpresentantes da Sociedade

## API

 API pública para consulta dos dados armazenados no banco de dados do projeto. Responsável, principalmente, por fornecer os dados que serão exibidos no website e no aplicativo móvel.

## Docs (temporário)

- `/api/candidatos`
  Retorna todos os candidatos divididos por cargo (ex.: presidente, governador etc)

- `/api/candidatos?estado={sigla do estado}`
  Retorna todos os candidatos divididos por cargo do estado indicado. Caso nenhum estado seja indicado, o padrão será 'SE'

- `/api/candidatos?nome={nome do candidato}&pagina={número da página}&itens{número de itens por página}`
  Retorna todas informações sobre um candidato

- `/api/candidatos?nome={nome do candidato}&tipo=resumido&pagina={número da página}&itens{número de itens por página}`
  Retorna somente o nome e a origem do candidato

- `/api/candidatos/{id}`
  Retorna todas as informações sobre um candidato, incluindo todas as candidaturas

- `/api/candidatos/{id}/candidaturas`
  Retorna todas as candidatuas a partir do id de um candidato

### Exemplo de retorno completo

```json
{
  "id": 4490,
  "nome": "Geronimo Ciqueira da Silva",
  "dataNascimento": "12/08/1956",
  "cpf": "139.653.104-10",
  "tituloEleitoral": "0050 2542 1775",
  "email": null,
  "cidadeNatal": "Mar Vermelho",
  "estadoOrigem": "Alagoas",
  "grauInstrucao": "Ensino Médio Completo",
  "ocupacao": "Vereador",
  "nacionalidade": "Brasileira Nata",
  "candidaturas": [
    {
      "id": 4495,
      "anoEleicao": 2004,
      "descricaoEleicao": "Eleicoes 2004",
      "cidade": "Maceió",
      "estado": "Alagoas",
      "numeroCandidato": 40654,
      "nomeUrna": "Gerônimo da Adefal",
      "siglaPartido": "PSB",
      "nomePartido": "Partido Socialista Brasileiro",
      "nomeLegenda": null,
      "composicaoLegenda": null,
      "cargo": "Vereador",
      "despesaMaxima": null,
      "situacaoCandidatura": "Deferido",
      "resultadoCandidatura": "Eleito"
    },
    {
      "id": 402324,
      "anoEleicao": 2006,
      "descricaoEleicao": "Eleicoes 2006",
      "cidade": null,
      "estado": "Alagoas",
      "numeroCandidato": 2566,
      "nomeUrna": "Gerônimo da Adefal",
      "siglaPartido": "DEM",
      "nomePartido": "Democratas",
      "nomeLegenda": "Alagoas Mudar Para Crescer",
      "composicaoLegenda": null,
      "cargo": "Deputado Federal",
      "despesaMaxima": 800000,
      "situacaoCandidatura": "Deferido",
      "resultadoCandidatura": "Eleito"
    }
  ],
  "mandatos": {
    "camara": {
      "idDeputado": 141444,
      "foto": "https://www.camara.leg.br/internet/deputado/bandep/141444.jpg",
      "gabinete": {
        "predio": null,
        "sala": null,
        "telefone": null,
        "email": "dep.gerônimodaadefal@camara.leg.br"
      },
      "website": null,
      "mandatos": [
        {
          "idLegislatura": 53,
          "dataInicio": "01/02/2007",
          "dataFim": "31/01/2011",
          "participacaoOrgaos": [
            {
              "orgao": "Comissão de Direitos Humanos e Minorias",
              "papel": "1º Vice-Presidente",
              "dataInicio": "14/02/2007",
              "dataFim": "03/11/2007"
            },
            {
              "orgao": "Comissão de Direitos Humanos e Minorias",
              "papel": "Titular",
              "dataInicio": "14/02/2007",
              "dataFim": "03/11/2007"
            },
            {
              "orgao": "Comissão de Seguridade Social e Família",
              "papel": "Suplente",
              "dataInicio": "14/02/2007",
              "dataFim": "03/11/2007"
            }
          ]
        }
      ]
    }
  }
}
```
