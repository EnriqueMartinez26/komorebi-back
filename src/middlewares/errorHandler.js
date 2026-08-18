export function notFoundHandler(_req, res) {
  res.status(404).json({
    message: "Recurso no encontrado."
  });
}

export function errorHandler(error, _req, res, _next) {
  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Identificador invalido.",
      details: null
    });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Error interno del servidor.",
    details: error.details || null
  });
}

