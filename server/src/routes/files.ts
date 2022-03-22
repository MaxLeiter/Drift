import { Router } from 'express'
import secretKey from '../lib/middleware/secret-key';
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

        // TODO: JWT-checkraw files
        if (file?.post?.visibility === "private") {
            // jwt(req as UserJwtRequest, res, () => {
            //     res.json(file);
            // })
            res.json(file);
        } else {
            res.json(file);
        }
    }
    catch (e) {
        next(e);
    }
});
