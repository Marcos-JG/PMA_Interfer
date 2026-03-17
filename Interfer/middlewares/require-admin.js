export const requireAdmin = (req, res, next) => {
  const role = String(req.user?.role || '').toUpperCase();

  if (!role) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: rol no presente en el token',
    });
  }

  const isAdmin = role === 'ADMIN_ROLE' || role === 'ADMIN';

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: solo administradores',
    });
  }

  next();
};
