import { Router } from "express";
// import { Movie } from '../models/Post'
import { File } from "../../lib/models/File";
import { Post } from "../../lib/models/Post";
import jwt, { UserJwtRequest } from "../../lib/middleware/jwt";
import * as crypto from "crypto";
import { User } from "../../lib/models/User";
import { celebrate, Joi } from "celebrate";

export const posts = Router();

posts.post(
  "/create",
  jwt,
  celebrate({
    body: {
      title: Joi.string().required(),
      files: Joi.any().required(),
      visibility: Joi.string().required(),
      userId: Joi.string().required(),
    },
  }),

  async (req, res, next) => {
    console.log(req.body);
    try {
      // Create the "post" object
      const newPost = new Post({
        title: req.body.title,
        visibility: req.body.visibility,
      });

      await newPost.save();
      await newPost.$add("users", req.body.userId);
      const newFiles = await Promise.all(
        req.body.files.map(async (file) => {
          // Establish a "file" for each file in the request
          const newFile = new File({
            title: file.title,
            content: file.content,
            sha: crypto
              .createHash("sha256")
              .update(file.content)
              .digest("hex")
              .toString(),
          });

          await newFile.$set("user", req.body.userId);
          await newFile.$set("post", newPost.id);
          await newFile.save();
          return newFile;
        })
      );

      await Promise.all(
        newFiles.map((file) => {
          newPost.$add("files", file.id);
          newPost.save();
        })
      );

      res.json(newPost);
    } catch (e) {
      next(e);
    }
  }
);

posts.get(
  "/:id",
  celebrate({
    params: {
      id: Joi.string().required(),
    },
  }),
  async (req: UserJwtRequest, res, next) => {
    try {
      const post = await Post.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: File,
            as: "files",
            attributes: [
              "id",
              "title",
              "content",
              "sha",
              "createdAt",
              "updatedAt",
            ],
          },
          {
            model: User,
            as: "users",
            attributes: ["id", "username"],
          },
        ],
      });

      if (post?.visibility === "public" || post?.visibility === "unlisted") {
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.json(post);
      } else {
        // TODO: should this be `private, `?
        res.setHeader("Cache-Control", "max-age=86400");
        jwt(req, res, () => {
          res.json(post);
        });
      }
    } catch (e) {
      next(e);
    }
  }
);
