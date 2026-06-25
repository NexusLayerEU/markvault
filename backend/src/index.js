require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { initDb } = require('./db')
const docsRouter = require('./routes/docs')
const userRouter = require('./routes/user')

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/v1/docs', docsRouter)
app.use('/v1/user', userRouter)
app.get('/health', (_, res) => res.json({ status: 'ok', product: 'markvault' }))

initDb().then(() => {
  app.listen(PORT, () => console.log(`MarkVault API → :${PORT}`))
}).catch(err => { console.error('DB init failed:', err); process.exit(1) })
