// backend/middleware/checkInactivity.js
const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

module.exports = (req, res, next) => {
  const now = Date.now();
  const lastActivity = req.session.lastActivity || now;

  if (now - lastActivity > TWO_HOURS) {
    // Clear session and redirect to login
    req.session.destroy((err) => {
      if (err) {
        console.error("Erro ao destruir a sessão:", err);
        return next(err);
      }
      return res.redirect("/login");
    });
  } else {
    // Update last activity time
    req.session.lastActivity = now;
    next();
  }
};
