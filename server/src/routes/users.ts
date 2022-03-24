import { Router } from "express"
// import jwt from "@lib/middleware/jwt";
// import { User } from "@lib/models/User";

export const users = Router()

// users.get("/", jwt, async (req, res, next) => {
//   try {
//     const allUsers = await User.findAll();
//     res.json(allUsers);
//   } catch (error) {
//     next(error);
//   }
// });
