// Vulnerable intencionalmente: este archivo existe para que Gitleaks/Semgrep lo detecten.
// En una aplicacion real, esto deberia venir de un secret manager o variables de entorno.

module.exports = {
  STRIPE_SECRET_KEY,
  JWT_SIGNING_SECRET,
};
