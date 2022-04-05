import * as request from "supertest"
import { app } from "../app"

describe("GET /health", () => {
	it("should return 200 and a status up", (done) => {
		request(app)
			.get(`/health`)
			.expect("Content-Type", /json/)
			.expect(200)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body).toMatchObject({ status: "UP" })
				done()
			})
	})
})
