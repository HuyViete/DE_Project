import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

export const connectDB = async () => {
  try {
    await pool.query('SELECT 1')
    console.log('MySQL connected')
  } catch (error) {
    console.error('MySQL connection failed', error)
    throw error
  }
}

export async function getUser(username) {
  const [rows] = await pool.query(`
    SELECT *
    from Users
    WHERE username = ?
    `, [username])
  return rows[0]
}

export async function createUser(username, password, email, firstName, lastName, exp, role) {
  await pool.query(`
    INSERT INTO Users (username, password, email, firstname, lastname, exp_year, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [username, password, email, firstName, lastName, exp, role])
}

export async function createSession(user_id, refreshToken, expiresAt) {
  await pool.query(`
    INSERT INTO Sessions (user_id, refresh_token, expires_at)
    VALUES (?, ?, ?)
  `, [user_id, refreshToken, expiresAt])
}

export async function deleteExpiredSessions() {
  await pool.query(`
    DELETE FROM Sessions
    WHERE expires_at <= NOW() OR revoked_at IS NOT NULL
  `)
}
