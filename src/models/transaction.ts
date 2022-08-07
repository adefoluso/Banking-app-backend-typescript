import mongoose from "mongoose";

interface TransactionDocument extends mongoose.Document {
	reference: string;
	senderAccount: string;
	recieverAccount: string;
  amount: number;
  transferDescription: string;
  senderId: string;
  recieverId: string;
}

const transactionSchema = new mongoose.Schema(
	{
		reference: {
      type: String,
      trim: true,
			unique: true,
			required: [true, "Transfer Reference is required."]
    },
    senderAccount: {
      type: String,
      trim: true,
      required: [true, "Sender Account is required."]
    },
    recieverAccount: {
      type: String,
      trim: true,
      required: [true, "Reciever Account is required."]
    },
    amount: {
      type: Number,
      required: [true, "Transfer Amount is required."]
    },
    transferDescription: {
      type: String,
      trim: true,
			required: [true, "Transfer Description is required."]
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
			required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
			required: true,
    }
	},
	{
		timestamps: {
      createdAt: true,
      updatedAt: false
    }
	}
);

const Transaction = mongoose.model<TransactionDocument>("Transaction", transactionSchema);

export default Transaction;
