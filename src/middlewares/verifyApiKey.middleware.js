import ENVIROMENT from '../config/enviroment.js'

const verifyApiKeyMiddleware = (res, req, next) => {
    const api_key = request.headers['x-api-key']
    if (api_key !== ENVIROMENT.API_KEY) {
        response.json({
            ok: false,
            status: 401,
            message: 'Unauthorized'
        })
    }else{
        next()
    }
}

export default verifyApiKeyMiddleware
