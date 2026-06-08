import { Router } from "express";
import { ContactController } from "../controllers/ContactController.js";
import { contactValidator } from "../validators/contactValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = Router();
const controller = new ContactController();

router.post("/", contactValidator, validateRequest, controller.send);

export default router;

