import { Router } from 'express'
import secretKey from '../lib/middleware/secret-key';
// import { Movie } from '../models/Post'
import { File } from '../lib/models/File'

export const files = Router()

files.get("/raw/:id", secretKey, async (req, res, next) => {
    try {
        const file = await File.findOne({
            where: {
                id: req.params.id
            },
            attributes: ["title", "content"],
        })
        res.json(file);
    }
    catch (e) {
        next(e);
    }
});
