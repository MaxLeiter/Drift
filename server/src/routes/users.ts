import { Router } from 'express'
// import { Movie } from '../models/Post'
import { genSalt, hash, compare } from "bcrypt"
import { User } from '../../lib/models/User'
import { File } from '../../lib/models/File'
import { sign } from 'jsonwebtoken'
import config from '../../lib/config'
import jwt, { UserJwtRequest } from '../../lib/middleware/jwt'
import { Post } from '../../lib/models/Post'

export const users = Router()

users.get('/', jwt, async (req, res, next) => {
    try {
        const allUsers = await User.findAll()
        res.json(allUsers)
    } catch (error) {
        next(error)
    }
})

users.get("/mine", jwt, async (req: UserJwtRequest, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    try {
        const user = await User.findByPk(req.user.id, {
            include: [
                {
                    model: Post,
                    as: "posts",
                    include: [
                        {
                            model: File,
                            as: "files"
                        }
                    ]
                },
            ],
        })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        return res.json(user.posts?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    } catch (error) {
        next(error)
    }
})

users.post('/signup', async (req, res, next) => {
    try {
        if (!req.body.username || !req.body.password) {
            throw new Error("Please provide a username and password")
        }

        const existingUser = await User.findOne({ where: { username: req.body.username } })
        if (existingUser) {
            throw new Error("Username already exists")
        }

        const salt = await genSalt(10)
        const user = {
            username: req.body.username as string,
            password: await hash(req.body.password, salt)
        }

        const created_user = await User.create(user);

        const token = generateAccessToken(created_user.id);

        res.status(201).json({ token: token, userId: created_user.id })
    } catch (e) {
        next(e);
    }
});

users.post('/login', async (req, res, next) => {
    try {
        if (!req.body.username || !req.body.password) {
            throw new Error("Missing username or password")
        }

        const user = await User.findOne({ where: { username: req.body.username } });
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
    return sign({ id: id }, config.jwt_secret, { expiresIn: '7d' });
}

users.get("/verify-token", jwt, async (req, res, next) => {
    try {
        res.status(200).json({
            message: "You are authenticated"
        })
    }
    catch (e) {
        next(e);
    }
})
