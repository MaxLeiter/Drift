import { Router } from 'express'
// import { Movie } from '../models/Post'
import { User } from '../lib/models/User'
import jwt from '../lib/middleware/jwt'

export const users = Router()

users.get('/', jwt, async (req, res, next) => {
    try {
        const allUsers = await User.findAll()
        res.json(allUsers)
    } catch (error) {
        next(error)
    }
})

