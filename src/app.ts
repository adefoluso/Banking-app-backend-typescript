import express, { Request, Response, NextFunction } from "express";
import createError, { HttpError } from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { UserDocument } from "./models/user";
import userRouter from './routes/user-routes';
import balanceRouter from './routes/balance-route';
import transactionsRouter from './routes/transaction-routes';

const app = express();

declare global {
	namespace Express {
		interface Request {
			user?: UserDocument;
		}
	}
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', userRouter);
app.use('/', balanceRouter);
app.use('/', transactionsRouter);

app.use((_req, _res, next) => {
	next(createError(404));
});

app.use((
	err: HttpError,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	res.status(err.status || 500).send(err.message || "Something went wrong");
});

export default app;
