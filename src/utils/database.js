import mysql from 'mysql'

let pool

const createPool = () => {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  })
  return pool
}

const getPool = () => pool || createPool()

const query = sql => (
  new Promise((resolve, reject) => {
    getPool()
    pool.getConnection((errorGetConnection, conn) => {
      if (errorGetConnection) {
        reject(errorGetConnection)
      }

      conn.query(sql, (errorQuery, results) => {
        conn.release()
        if (errorQuery) {
          reject(errorQuery)
        }
        resolve(results)
      })
    })
  })
)

const database = {
  query,
}

export default database
