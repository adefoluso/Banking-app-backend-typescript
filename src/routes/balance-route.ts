import express from "express";
import {
	deposit,
	getAllBalance,
	getBalance,
} from "../controllers/balance-controller";
import { isAuthenticated } from "../middleware/is-authenticated";
import { validateBalanceInput } from "../middleware/validate-balance-input";

const router = express.Router();

router.post("/api/balance", isAuthenticated, validateBalanceInput, deposit);

router.get("/api/balance", isAuthenticated, getAllBalance);

router.get("/api/balance/:accountNumber", isAuthenticated, getBalance);

export default router;
