import { body } from "express-validator";

export const createOrderValidator = [
  body("shippingMethod")
    .trim()
    .notEmpty()
    .withMessage("Metodo de envio requerido."),
  body("shippingAddress")
    .trim()
    .notEmpty()
    .withMessage("Direccion requerida.")
];

