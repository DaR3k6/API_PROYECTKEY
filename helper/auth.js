const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const jwtToken = req.header("Authorization");

  // Verifica si el token tiene el prefijo "Bearer"
  if (!jwtToken || !jwtToken.startsWith("Bearer")) {
    return res.status(401).json({
      resultado: "error",
      mensaje: "Acceso denegado, No tiene token válido",
    });
  }

  // Extrae el token sin el prefijo "Bearer"
  const actualToken = jwtToken.substring("Bearer ".length);

  try {
    const payload = jwt.verify(actualToken, process.env.SECRETO);
    console.log("Token verificado. Payload:", payload);
    req.user = payload;
    next();
  } catch (error) {
    console.error("Error verificando el token:", error);
    return res.status(401).json({
      resultado: "error",
      mensaje: "Token no válido",
    });
  }
};

module.exports = auth;
