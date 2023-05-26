import express from 'express'
import router from './Router/index.js'
import cors from 'cors'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express() 

app.use(cors())
app.use(express.json())
app.use(router)

app.listen(3000)