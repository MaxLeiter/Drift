import { Router } from "express"

export const health = Router()

health.get("/", async (req, res) => {
	return res.json({
		status: "UP"
	})
})
