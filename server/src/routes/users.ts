import { Router } from "express";
import { User } from "../../lib/models/User";
import { File } from "../../lib/models/File";
import jwt, { UserJwtRequest } from "../../lib/middleware/jwt";
import { Post } from "../../lib/models/Post";

export const users = Router();

users.get("/", jwt, async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

users.get("/mine", jwt, async (req: UserJwtRequest, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
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
              as: "files",
            },
          ],
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(
      user.posts?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    );
  } catch (error) {
    next(error);
  }
});
