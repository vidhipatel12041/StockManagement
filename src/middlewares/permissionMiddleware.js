function requirePermission(permissionKey) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(403).render('errors/403', { error: { message: 'Forbidden' } });
    const permissions = (user.role && user.role.permissions) || [];
    const hasPermission = permissions.some((permission) => permission.key === permissionKey.toUpperCase().trim());
    if (!hasPermission) {
      return res.status(403).render('errors/403', { error: { message: 'Forbidden' } });
    }
    next();
  };
}

module.exports = { requirePermission };
