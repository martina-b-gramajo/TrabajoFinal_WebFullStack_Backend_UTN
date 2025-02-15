import pool from '../config/mysql.config.js'

class UserRepository {

    async createUser({ username, email, password, verificationToken }) {
        const queryStr = `
        INSERT INTO USERS (username, email, password, verificationToken)
        VALUES (?, ?, ?, ?)
        `
        const [result, fields] = await pool.execute(
            queryStr,
            [username, email, password, verificationToken]
        )
        return {
            _id: result.insertId,
            username,
            email
        }
    }

    async findUserByEmail(email) {
        const queryStr = `SELECT * FROM USERS WHERE email = ?`
        const [result] = await pool.execute(queryStr, [email])
        return result[0] || null
    }

    async findById(id) {
        const queryStr = `SELECT * FROM USERS WHERE _id = ?`
        const [result] = await pool.execute(queryStr, [id])
        return result[0] || null
    }

    async verifyUser(user_id) {
        const queryStr = `
        UPDATE USERS
        SET verified = 1
        WHERE _id = ?
        `
        await pool.execute(queryStr, [user_id])
    }

    async updateUserPassword(user_id, new_password_hash) {
        const queryStr = `
            UPDATE USERS
            SET password = ?
            WHERE _id = ?
        `
        await pool.execute(queryStr, [new_password_hash, user_id]);
    }
}

export default new UserRepository()