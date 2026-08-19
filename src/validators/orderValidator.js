import { body } from "express-validator";
import { PAYMENT_METHODS } from "../utils/paymentMethods.js";

export const createOrderValidator = [
  body("shippingMethod")
    .trim()
    .notEmpty()
    .withMessage("Metodo de envio requerido."),
  body("shippingAddress")
    .trim()
    .notEmpty()
    .withMessage("Direccion requerida."),
  body("paymentMethod")
    .trim()
    .isIn(PAYMENT_METHODS)
    .withMessage("Medio de pago invalido.")
];

