import capitalize from 'capitalize-pt-br'

// dd/mm/yyyy
export const data = value => (
  value
    ? value.toISOString().split('T')[0].split('-').reverse().toString().replace(/,/g, '/')
    : null
)
// ddd.ddd.ddd-dd
export const cpf = value => (
  value
    ? value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
    : null
)
// dddd dddd dddd
export const tituloEleitoral = value => (
  value
    ? value.replace(/(\d{4})(\d{4})(\d{4})/g, '$1 $2 $3')
    : null
)
// Nome Próprio com a Primeira Letra em Capslock
export const nomeProprio = value => (
  value
    ? capitalize(value)
    : null
)
// fulaninho@mailneiro.com
export const email = value => (
  value
    ? value.toLowerCase()
    : null
)
