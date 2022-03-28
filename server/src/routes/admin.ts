import isAdmin from "@lib/middleware/is-admin";
import { Post } from "@lib/models/Post";
import { User } from "@lib/models/User";
import { File } from "@lib/models/File";
import { Router } from "express";

export const admin = Router()

admin.use(isAdmin)

admin.get("/is-admin", async (req, res) => {
    return res.json({
        isAdmin: true
    })
})

admin.get("/users", async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ["password"],
                include: ["id", "username", "createdAt", "updatedAt"]
            },
            include: [
                {
                    model: Post,
                    as: "posts",
                    attributes: ["id"]
                }
            ],
        })
        res.json(users)
    } catch (e) {
        next(e)
    }
})

admin.get("/posts", async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            attributes: {
                exclude: ["content"],
                include: ["id", "title", "visibility", "createdAt"]
            },
            include: [
                {
                    model: File,
                    as: "files",
                    attributes: ["id", "title", "content", "sha", "createdAt", "updatedAt"]
                },
                {
                    model: User,
                    as: "users",
                    attributes: ["id", "username"]
                }
            ]
        })
        res.json(posts)
    } catch (e) {
        next(e)
    }
})

