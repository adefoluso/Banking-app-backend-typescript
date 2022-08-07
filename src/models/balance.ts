import mongoose from "mongoose";

export interface BalanceDocument extends mongoose.Document {
	accountNumber: string;
	amount: number;
	owner: string;
}

const balanceSchema = new mongoose.Schema(
	{
		accountNumber: {
			type: String,
			minLength: 10,
			maxlength: 10,
			trim: true,
			unique: true,
			required: [true, "Account Number is required."],
		},
		amount: {
			type: Number,
			required: [true, "Amount is required."],
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Balance = mongoose.model<BalanceDocument>("Balance", balanceSchema);

export default Balance;
