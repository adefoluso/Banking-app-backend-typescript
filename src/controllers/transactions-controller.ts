import { Request, Response } from "express";
import { nanoid } from "nanoid";
import Balance, { BalanceDocument } from "../models/balance";
import Transaction from "../models/transaction";
import getPaginationData from "../utils/pagination";

const transfer = async (req: Request, res: Response) => {
	const { senderAccount, recieverAccount, amount } = req.body;
	if (senderAccount === recieverAccount) {
		return res.status(400).json({
			error: "Invalid Transaction",
		});
	}

	try {
		const sender = (await Balance.findOne({
			accountNumber: senderAccount,
		})) as BalanceDocument;
		const reciever = await Balance.findOne({ accountNumber: recieverAccount });
		const reference = nanoid(8);

		if (!reciever) {
			return res.status(404).json({
				error: "The reciever account number does not exist",
			});
		}

		sender.amount -= parseInt(amount);
		reciever.amount += parseInt(amount);

		const transaction = new Transaction({
			...req.body,
			reference,
			senderId: req.user?._id,
			recieverId: reciever.owner,
		});

		await Promise.all([sender?.save(), reciever.save(), transaction.save()]);

		res.status(201).json({
			message: "Transfer successful",
		});
	} catch (err) {
		res.status(400).json({
			error: err.message,
		});
	}
};

const getTransactions = async (req: Request, res: Response) => {
	const page = (req.query.page as string) || "1";
	const filter = {
		$or: [{ senderId: req.user?._id }, { recieverId: req.user?._id }],
	};

	try {
		const count = await Transaction.countDocuments(filter);
		const { previous, next, skip } = getPaginationData(page, count);
		const data = await Transaction.find(filter).limit(5).skip(skip);

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

const getTransactionsByRef = async (req: Request, res: Response) => {
	const filter = {
		$and: [
			{ $or: [{ senderId: req.user?._id }, { recieverId: req.user?._id }] },
			{ reference: req.params.reference },
		],
	};

	try {
		const transaction = await Transaction.findOne(filter);
		if (!transaction)
			return res.status(404).json({ message: "Transaction not found" });

		res.status(200).json(transaction);
	} catch (err) {
		res.status(400).json({
			error: err.message,
		});
	}
};

export { transfer, getTransactions, getTransactionsByRef };
