import { Request, Response } from "express";
import Balance from "../models/balance";
import getPaginationData from "../utils/pagination";

const deposit = async (req: Request, res: Response) => {
	const { accountNumber, amount } = req.body;
	const balance = new Balance({
		accountNumber,
		amount,
		owner: req.user?._id,
	});

	try {
		await balance.save();
		res.status(201).json({
			message: "Deposit Successful",
		});
	} catch (err) {
		res.status(400).json({
			error: err.message,
		});
	}
};

const getAllBalance = async (req: Request, res: Response) => {
	const page = (req.query.page as string) || "1";

	try {
		const count = await Balance.countDocuments({ owner: req.user?._id });
		const { previous, next, skip } = getPaginationData(page, count);
		const data = await Balance.find({ owner: req.user?._id })
			.limit(5)
			.skip(skip);

		res.status(200).json({
			previous,
			next,
			data,
		});
	} catch (err) {
		res.status(400).json({
			error: err.message,
		});
	}
};

const getBalance = async (req: Request, res: Response) => {
	try {
		const balance = await Balance.findOne({
			owner: req.user?._id,
			accountNumber: req.params.accountNumber,
		});

		if (!balance) return res.status(404).json({ message: "Account Not Found" });

		res.status(200).json(balance);
	} catch (err) {
		res.status(400).json({
			error: err.message,
		});
	}
};

export { deposit, getAllBalance, getBalance };
