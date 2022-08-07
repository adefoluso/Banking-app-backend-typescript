import { Request, Response, NextFunction } from "express";
import Balance from "../models/balance";

const isAccountOwner = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const account = await Balance.findOne({
		accountNumber: req.body.senderAccount,
	});

	if (!account) {
		return res.status(404).json({
			error: "Sender account does not exist",
		});
	}

	if (req.user?._id.toString() !== account.owner.toString()) {
		return res.status(403).json({
			error: "The sender account does not belong to you",
		});
	}

	next();
};

export { isAccountOwner };
