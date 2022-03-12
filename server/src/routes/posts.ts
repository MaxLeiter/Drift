import { Router } from 'express'
// import { Movie } from '../models/Post'
import { File } from '../../lib/models/File'
import { Post } from '../../lib/models/Post';
import jwt, { UserJwtRequest } from '../../lib/middleware/jwt';
import * as crypto from "crypto";
import { User } from '../../lib/models/User';

export const posts = Router()

posts.post('/create', jwt, async (req, res, next) => {
    try {
        if (!req.body.files) {
            throw new Error("Please provide files.")
        }

        if (!req.body.title) {
            throw new Error("Please provide a title.")
        }

        if (!req.body.userId) {
            throw new Error("No user id provided.")
        }

        if (!req.body.visibility) {
            throw new Error("Please provide a visibility.")
        }

        // Create the "post" object 
        const newPost = new Post({
            title: req.body.title,
            visibility: req.body.visibility,
        })

        await newPost.save()
        await newPost.$add('users', req.body.userId);
        const newFiles = await Promise.all(req.body.files.map(async (file) => {
            // Establish a "file" for each file in the request
            const newFile = new File({
                title: file.title,
                content: file.content,
                sha: crypto.createHash('sha256').update(file.content).digest('hex').toString(),
            })

            await newFile.$set("user", req.body.userId);
            await newFile.$set("post", newPost.id);
            await newFile.save();
            return newFile;
        }))

        await Promise.all(newFiles.map((file) => {
            newPost.$add("files", file.id);
            newPost.save();
        }))

        res.json(newPost);
    } catch (e) {
        next(e);
    }
});

posts.get("/:id", async (req: UserJwtRequest, res, next) => {
    try {
        const post = await Post.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: File,
                    as: "files",
                    attributes: ["id", "title", "content", "sha", "createdAt", "updatedAt"],
                },
                {
                    model: User,
                    as: "users",
                    attributes: ["id", "username"],
                },
            ]
        })

        if (post?.visibility === 'public' || post?.visibility === 'unlisted') {
            res.setHeader("Cache-Control", "public, max-age=86400");
            res.json(post);
        } else {
            // TODO: should this be `private, `?
            res.setHeader("Cache-Control", "max-age=86400");
            jwt(req, res, () => {
                res.json(post);
            });
        }
    }
    catch (e) {
        next(e);
    }
});

