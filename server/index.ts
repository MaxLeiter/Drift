import * as dotenv from "dotenv"
import { existsSync } from "fs";

if (existsSync(".env.local")) {
    console.info("using `.env.local` environment file")
    dotenv.config({ path: '.env.local' })
} else {
    dotenv.config()
}

import "./src/server"
