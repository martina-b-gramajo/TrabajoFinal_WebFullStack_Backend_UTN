import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const statusRoute = express.Router()

statusRoute.get('/ping', (request, response) => {
    response.json({
        status: 200,
        ok: true,
        message: "Pong"
    })
})

statusRoute.get('/protected/ping', authMiddleware, (request, response) => {
    try {
        console.log(request.headers.user)
        response.sendStatus(200)
    }
    catch (error) {
        console.error(error)
        response.json({
            ok: false,
            status: 401,
            message: 'Unauthorized'
        })
    }
})

export default statusRoute


