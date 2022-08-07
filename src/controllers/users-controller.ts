import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

const register = async (req: Request, res: Response) => {
	const user = new User(req.body);

	try {
		await user.save();
		res.status(201).json({
			message: "Registration Complete",
		});
	} catch (err) {
		res.status(400).json({
			error: err.message,
		});
	}
};

const signIn = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const user = await User.validateCredentials(email, password);
		const secret = process.env.JWT_SECRET!;
		const token = jwt.sign({ _id: user._id }, secret);

		res.cookie("tko", token, {
			maxAge: 1000 * 60 * 60,
			httpOnly: false,
		});

		res.status(200).json({ user, token });
	} catch (err) {
		res.status(400).json({
			error: err.message,
		});
	}
};

const signOut = async (req: Request, res: Response) => {
	res.clearCookie("tko");
	return res.status(200).json({
		message: "signed out successfully",
	});
};

export { register, signIn, signOut };
