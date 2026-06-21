import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createLinkSchema } from "../validators/link.validator.js";
import { linkController } from "../controllers/link.controller.js";

const router: Router = Router();

router.post(
  "/",
  authenticate,
  validate(createLinkSchema),
  linkController.create,
);

router.get("/:user", linkController.getByUser);

router.get("/:user/analytics", authenticate, linkController.getAnalytics);

export default router;
