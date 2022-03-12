import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as errorhandler from 'strong-error-handler';
import * as cors from 'cors';
import { posts, users, auth, files } from './routes';

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));

const corsOptions = {
    origin: `http://localhost:3001`,
};
app.use(cors(corsOptions));

app.use("/auth", auth)
app.use("/posts", posts)
app.use("/users", users)
app.use("/files", files)

app.use(errorhandler({
    debug: process.env.ENV !== 'production',
    log: true,
}));
