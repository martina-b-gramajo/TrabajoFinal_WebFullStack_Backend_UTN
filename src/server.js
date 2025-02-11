import express from 'express'
import ENVIROMENT from './config/enviroment.js'
import mongoose from './config/mongoDB.config.js'
import connectToMongoDB from './config/mongoDB.config.js'
import User from './models/User.model.js'
import statusRoute from './routes/status.route.js'
import authRouter from './routes/auth.route.js'
import channelRouter from './routes/channel.route.js'
import { sendMail } from './utils/mail.util.js'
import workspaceRouter from './routes/workspace.route.js'
import cors from 'cors'

const app = express()
const PORT = ENVIROMENT.PORT

//Cross-Origin Resource Sharing
app.use(
    cors({
        origin: 'http://localhost:5173'
    })
)

app.use(express.json())

app.use('/api/status', statusRoute)

app.use('/api/auth', authRouter)

app.use('/api/workspace', workspaceRouter)

app.use('/api/channel', channelRouter)

app.listen(PORT, () => {
    console.log(`El servidor se esta ejecutando en http://localhost:${PORT}`)
})
