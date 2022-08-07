import { Request, Response, NextFunction } from "express";
import Balance, { BalanceDocument } from "../models/balance";

const isBalanceSufficient = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const account = await Balance.findOne({
		accountNumber: req.body.senderAccount,
	}) as BalanceDocument;

	if (req.body.amount > account?.amount) {
		return res.status(403).json({
			error: "Insufficient Funds",
		});
	}

	next();
};

export { isBalanceSufficient };
