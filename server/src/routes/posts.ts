import { Router } from 'express'
// import { Movie } from '../models/Post'
import { File } from '../lib/models/File'
import { Post } from '../lib/models/Post';
import jwt, { UserJwtRequest } from '../lib/middleware/jwt';
import * as crypto from "crypto";
import { User } from '../lib/models/User';
import secretKey from '../lib/middleware/secret-key';

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

        const newPost = new Post({
            title: req.body.title,
            visibility: req.body.visibility,
        })

        await newPost.save()
        await newPost.$add('users', req.body.userId);
        const newFiles = await Promise.all(req.body.files.map(async (file) => {
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

posts.get("/", secretKey, async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            attributes: ["id", "title", "visibility", "createdAt"],
        })
        res.json(posts);
    } catch (e) {
        next(e);
    }
});

posts.get("/:id", secretKey, async (req, res, next) => {
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
        if (!post) {
            throw new Error("Post not found.")
        }

        if (post.visibility === 'public' || post?.visibility === 'unlisted') {
            res.json(post);
        } else if (post.visibility === 'private') {
            console.log("here")
            jwt(req as UserJwtRequest, res, () => {
                res.json(post);
            })
        } else if (post.visibility === 'protected') {

        }
    }
    catch (e) {
        next(e);
    }
});

