import { NextFunction, Request, Response } from 'express';

const key = process.env.SECRET_KEY;
if (!key) {
    throw new Error('SECRET_KEY is not set.');
}

export default function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const requestKey = req.headers['x-secret-key']
    if (requestKey !== key) {
        return res.sendStatus(401)
    }
    next()
}
