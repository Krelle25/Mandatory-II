import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import session from 'express-session';

import authRouter from './routers/authRouter.js';
import { initDatabase } from './database/createDatabase.js';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(helmet());
app.use(express.json());


const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
});

app.use(generalLimiter);

app.use(session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}));

app.use("/auth", authLimiter, authRouter);

const PORT = process.env.PORT ?? 8080;

await initDatabase();

app.listen(PORT, () => {
    console.log("Server is running port", PORT);
});