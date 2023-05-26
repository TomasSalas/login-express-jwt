import { createPool } from "mysql2/promise";

export const pool = createPool({
  host: process.env.HOST || 'localhost',
  user: process.env.USERNAME || 'root',
  password: process.env.PASSWORD || 'password' ,
  database: process.env.DATABASE || 'TestLogin',
  port: process.env.PORTDB || 3306,
})