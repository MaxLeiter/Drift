import { Router } from 'express'
// import { Movie } from '../models/Post'
import { File } from '../../lib/models/File'

export const files = Router()

files.get("/raw/:id", async (req, res, next) => {
    try {
        const file = await File.findOne({
            where: {
                id: req.params.id
            },
            attributes: ["title", "content"],
        })
        // TODO: fix post inclusion
        // if (file?.post.visibility === 'public' || file?.post.visibility === 'unlisted') {
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.json(file);
        // } else {
        // TODO: should this be `private, `?
        // res.setHeader("Cache-Control", "max-age=86400");
        // res.json(file);
        // }
    }
    catch (e) {
        next(e);
    }
});

