import express from "express";
import {
	transfer,
	getTransactions,
	getTransactionsByRef,
} from "../controllers/transactions-controller";
import { isAuthenticated } from "../middleware/is-authenticated";
import { isAccountOwner } from "../middleware/is-account-owner";
import { isBalanceSufficient } from "../middleware/is-balance-sufficient";
import { validateTransactionInput } from "../middleware/validate-transaction-input";

const router = express.Router();

router.post(
	"/api/transactions",
	isAuthenticated,
	validateTransactionInput,
	isAccountOwner,
	isBalanceSufficient,
	transfer
);

router.get("/api/transactions", isAuthenticated, getTransactions);

router.get(
	"/api/transactions/:reference",
	isAuthenticated,
	getTransactionsByRef
);

export default router;
