const checkInactivity = (req, res, next) => {
  const maxInactivity = 20 * 60 * 1000; // 20 minutes
  const now = Date.now();

  if (
    req.session.lastActivity &&
    now - req.session.lastActivity > maxInactivity
  ) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/pages/login.html");
    });
  } else {
    req.session.lastActivity = now;
    next();
  }
};

module.exports = checkInactivity;
