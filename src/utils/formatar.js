import capitalize from 'capitalize-pt-br'
import moment from 'moment'

// dd/mm/yyyy
export const data = value => (
  value
    ? value.toISOString().split('T')[0].split('-').reverse().toString().replace(/,/g, '/')
    : null
)
// xx anos
export const idade = (value) => {
  const dataNascimento = data(value)
  return dataNascimento
    ? `${moment().diff(moment(dataNascimento, 'DD/MM/YYYY'), 'years')} anos`
    : null
}
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
