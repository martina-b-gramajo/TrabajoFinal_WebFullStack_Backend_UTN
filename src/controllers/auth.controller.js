import jwt from 'jsonwebtoken'
import ENVIROMENT from '../config/enviroment.js'
import { sendMail } from '../utils/mail.util.js'
import bcrypt from 'bcrypt'
import UserRepository from '../repository/user.repository.js'

const QUERY = {
    VERIFICATION_TOKEN: 'verification_token'
}

export const registerController = async (request, response) => {
    try {
        const { username, email, password } = request.body

        //validamos estos datos (Queda de tarea)

        const user_found = await UserRepository.findUserByEmail(email)

        if (user_found) {
            return response.json({
                ok: false,
                status: 400,
                message: 'Email user already exists',
            })
        }
        const verificationToken = jwt.sign({ email }, ENVIROMENT.SECRET_KEY_JWT, { expiresIn: '1d' })
        await sendMail(
            {
                to: email,
                subject: 'Valida tu mail',
                html: `
                    <h1 >Debes validar tu mail!</h1>
                    <p>Da click en el enlace de 'verificar' para poder validar tu mail</p>
                    <a 
                        href='${ENVIROMENT.URL_BACKEND}/api/auth/verify-email?${QUERY.VERIFICATION_TOKEN}=${verificationToken}'
                    >
                        Verificar
                    </a>
                `
            }
        )

        const password_hash = await bcrypt.hash(password, 10)
        await UserRepository.createUser({ username, email, password: password_hash, verificationToken })
        response.json({
            ok: true,
            status: 201,
            message: 'User registered successfully',
            data: {
            }
        })
    }
    catch (error) {
        console.error(error)
        response.json({
            ok: false,
            status: 500,
            message: 'Server error'
        })
    }
}

export const verifyEmailController = async (req, res) => {
    try {
        const { [QUERY.VERIFICATION_TOKEN]: verification_token } = req.query
        if (!verification_token) {
            return res.redirect(`${ENVIROMENT.URL_FRONTEND}/error?error=REQUEST_EMAIL_VERIFY_TOKEN`)

        }
        const payload = jwt.verify(verification_token, ENVIROMENT.SECRET_KEY_JWT)
        const user_to_verify = await UserRepository.findUserByEmail(payload.email)
        if (!user_to_verify) {
            return res.redirect(`${ENVIROMENT.URL_FRONTEND}/error?error=REQUEST_EMAIL_VERIFY_TOKEN`)
        }
        if (user_to_verify.verificationToken !== verification_token) {
            return res.redirect(`${ENVIROMENT.URL_FRONTEND}/error?error=RESEND_VERIFY_TOKEN`)
        }
        await UserRepository.verifyUser(user_to_verify._id)
        return res.redirect(`${ENVIROMENT.URL_FRONTEND}/login?verified=true`)
    }
    catch (error) {
        console.log(error)
        res.json({
            status: 500,
            message: "Internal server error",
            ok: false
        })
    }
}

export const loginController = async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body
        const errors = {
            email: null,
            password: null,
        };

        if (!email || !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email))) {
            errors.email = "You must enter a valid value for email";
        }

        if (!password) {
            errors.password = "You must enter a password";
        }

        let hayErrores = false
        for (let error in errors) {
            if (errors[error]) {
                hayErrores = true
            }
        }

        if (hayErrores) {

            return res.json({
                message: "Errors exist!",
                ok: false,
                status: 400,
                errors: errors,
            });
        }

        const user_found = await UserRepository.findUserByEmail(email)
        console.log(user_found)
        if (!user_found) {

            return res.json({
                ok: false,
                status: 404,
                message: "there is no user with this email",
            });
        }
        const is_same_password = await bcrypt.compare(password, user_found.password)
        if (!is_same_password) {
            return res.json({
                ok: false,
                status: 400,
                message: "Wrong password",
            });
        }

        const user_info = {
            id: user_found._id,
            name: user_found.name,
            email: user_found.email,
        }

        const access_token = jwt.sign(user_info, ENVIROMENT.SECRET_KEY_JWT)

        return res.json({
            ok: true,
            status: 200,
            message: "Logged in",
            data: {
                user_info: {
                    id: user_found._id,
                    name: user_found.name,
                    email: user_found.email,
                },
                access_token: access_token
            }
        })
    }
    catch (error) {
        console.error(error)
        return res.json({
            ok: false,
            message: "Internal server error",
            status: 500,
        })
    }

}

export const forgotPasswordController = async (req, res) => {
    try {
        console.log(req.body)
        const { email } = req.body
        const user_found = await UserRepository.findUserByEmail(email)
        if (!user_found) {
            return res.json({
                ok: false,
                status: 404,
                message: 'User not found'
            })
        }
        else {
            const reset_token = jwt.sign({ email }, ENVIROMENT.SECRET_KEY_JWT, { expiresIn: '1d' })
            const reset_url = `${ENVIROMENT.URL_FRONTEND}/reset-password?reset_token=${reset_token}`
            await sendMail({
                to: email,
                subject: 'Restablecer contraseña',
                html: `
                    <h1>Restablecer contraseña</h1>
                    <p>Haz click en el enlace de abajo para restablecer tu contraseña</p>
                    <a href='${reset_url}'>Restablecer contraseña</a>
                `
            })
            return res.json({
                ok: true,
                status: 200,
                message: 'Email sent'
            })
        }
    }
    catch (error) {
        console.error(error)
        return res.json({
            ok: false,
            message: "Internal server error",
            status: 500,
        })
    }
}

export const resetPasswordController = async (req, res) => {
    try {
        const { reset_token } = req.query
        const { password } = req.body

        const { email } = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY_JWT)
        const user_found = await UserRepository.findUserByEmail(email)
        const password_hash = await bcrypt.hash(password, 10)

        await UserRepository.updateUserPassword(user_found._id, password_hash)
        return res.json({
            ok: true,
            status: 200,
            message: 'Password changed'
        })
    }
    catch (error) {
        console.error(error)
        return res.json({
            ok: false,
            message: "Internal server error",
            status: 500,
        })
    }
} 
