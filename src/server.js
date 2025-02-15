import express from 'express'
import ENVIROMENT from './config/enviroment.js'
import statusRoute from './routes/status.route.js'
import authRouter from './routes/auth.route.js'
import channelRouter from './routes/channel.route.js'
import workspaceRouter from './routes/workspace.route.js'
import cors from 'cors'
import verifyApiKeyMiddleware from './middlewares/verifyApiKey.middleware.js'

const app = express()
const PORT = ENVIROMENT.PORT

//Cross-Origin Resource Sharing
app.use(
    cors({
        origin: ENVIROMENT.URL_FRONTEND
    })
)

app.use(express.json())

app.use(verifyApiKeyMiddleware)

app.use('/api/status', statusRoute)

app.use('/api/auth', authRouter)

app.use('/api/workspace', workspaceRouter)

app.use('/api/channel', channelRouter)

app.listen(PORT, () => {
    console.log(`El servidor se esta ejecutando en http://localhost:${PORT}`)
})
