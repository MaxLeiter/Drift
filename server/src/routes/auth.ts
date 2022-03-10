import { Router } from 'express'
// import { Movie } from '../models/Post'
import { genSalt, hash, compare } from "bcrypt"
import { User } from '../../lib/models/User'
import { sign } from 'jsonwebtoken'
import config from '../../lib/config'
import jwt from '../../lib/middleware/jwt'

export const auth = Router()

auth.post('/signup', async (req, res, next) => {
    try {
        if (!req.body.username || !req.body.password) {
            throw new Error("Please provide a username and password")
        }

        const username = req.body.username.toLowerCase();

        const existingUser = await User.findOne({ where: { username: username } })
        if (existingUser) {
            throw new Error("Username already exists")
        }

        const salt = await genSalt(10)
        const user = {
            username: username as string,
            password: await hash(req.body.password, salt)
        }

        const created_user = await User.create(user);

        const token = generateAccessToken(created_user.id);

        res.status(201).json({ token: token, userId: created_user.id })
    } catch (e) {
        next(e);
    }
});

auth.post('/signin', async (req, res, next) => {
    try {
        if (!req.body.username || !req.body.password) {
            throw new Error("Missing username or password")
        }

        const username = req.body.username.toLowerCase();
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            throw new Error("User does not exist");
        }

        const password_valid = await compare(req.body.password, user.password);
        if (password_valid) {
            const token = generateAccessToken(user.id);
            res.status(200).json({ token: token, userId: user.id });
        } else {
            throw new Error("Password Incorrect");
        }

    } catch (e) {
        next(e);
    }
});

function generateAccessToken(id: string) {
    return sign({ id: id }, config.jwt_secret, { expiresIn: '2d' });
}

auth.get("/verify-token", jwt, async (req, res, next) => {
    try {
        res.status(200).json({
            message: "You are authenticated"
        })
    }
    catch (e) {
        next(e);
    }
})
