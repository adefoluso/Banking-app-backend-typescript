import express from "express";
import { register, signIn, signOut } from "../controllers/users-controller";
import { isAuthenticated } from "../middleware/is-authenticated";
import { validateUserSignIn } from "../middleware/validate-user-signin";
import { validateUserRegistration } from "../middleware/validate-user-registration";

const router = express.Router();

router.post("/auth/signup", validateUserRegistration, register);

router.post("/auth/signin", validateUserSignIn, signIn);

router.get("/auth/signout", isAuthenticated, signOut);

export default router;