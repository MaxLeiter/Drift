import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as errorhandler from 'strong-error-handler';
import * as cors from 'cors';

import { users } from './routes/users'
import { posts } from './routes/posts'

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));

const corsOptions = {
    origin: `http://localhost:3001`,
};
app.use(cors(corsOptions));

app.use("/users", users)
app.use("/posts", posts)

app.use(errorhandler({
    debug: process.env.ENV !== 'production',
    log: true,
}));
