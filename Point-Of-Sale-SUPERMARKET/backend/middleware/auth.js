import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET || 'development-secret'); next(); } catch { res.status(401).json({ error: 'Invalid or expired session' }); }
}
export function requireRole(...roles) { return (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'Insufficient permissions' }); }
export function errorHandler(err, req, res, next) { console.error(err); res.status(err.status || 500).json({ error: err.message || 'Unexpected server error' }); }
