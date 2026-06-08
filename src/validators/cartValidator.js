import { body } from "express-validator";

export const addCartItemValidator = [
  body("productId").trim().notEmpty().withMessage("Producto requerido."),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Cantidad invalida.")
];

export const updateCartItemValidator = [
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Cantidad invalida.")
];

