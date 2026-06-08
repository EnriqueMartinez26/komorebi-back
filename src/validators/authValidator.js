import { body } from "express-validator";

export const registerValidator = [
  body("firstName").trim().notEmpty().withMessage("Nombre requerido."),
  body("lastName").trim().notEmpty().withMessage("Apellido requerido."),
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username invalido."),
  body("email").isEmail().withMessage("Email invalido."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contrasena debe tener al menos 8 caracteres."),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Las contrasenas no coinciden.")
];

export const loginValidator = [
  body("identifier").trim().notEmpty().withMessage("Email o username requerido."),
  body("password").notEmpty().withMessage("Contrasena requerida.")
];

export const forgotPasswordValidator = [
  body("email").isEmail().withMessage("Email invalido.")
];

export const resetPasswordValidator = [
  body("token").trim().notEmpty().withMessage("Token requerido."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contrasena debe tener al menos 8 caracteres."),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Las contrasenas no coinciden.")
];

