import { Router, type IRouter } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { authController } from "../controllers/auth.controller.js";

const router: IRouter = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.post("/logout", authController.logout);

export default router;
