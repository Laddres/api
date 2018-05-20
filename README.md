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
