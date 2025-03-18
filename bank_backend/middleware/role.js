// bank_backend/middleware/role.js

//role işlemlerini yap, kısıtlamalar yap!!

module.exports = function (allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Erişim yetkiniz yok" });
    }
    next();
  };
};
