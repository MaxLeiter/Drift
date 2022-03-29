export default {
	port: process.env.PORT || 3000,
	jwt_secret: process.env.JWT_SECRET || "myjwtsecret",
	drift_home: process.env.DRIFT_HOME || "~/.drift"
}
