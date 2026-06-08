import { body } from "express-validator";

export const contactValidator = [
  body("name").trim().notEmpty().withMessage("Nombre requerido."),
  body("email").isEmail().withMessage("Email invalido."),
  body("message")
    .trim()
    .isLength({ min: 10 })
    .withMessage("El mensaje debe tener al menos 10 caracteres.")
];

