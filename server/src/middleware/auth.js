import crypto from 'crypto';

// Secret key or derived token from ADMIN_PIN
const ADMIN_PIN = process.env.ADMIN_PIN || '202688';

export function generateAdminToken(pin) {
  return crypto.createHmac('sha256', 'nga-pijama-secret-salt-2026').update(pin).digest('hex');
}

export const VALID_ADMIN_TOKEN = generateAdminToken(ADMIN_PIN);

export function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_token || req.headers['x-admin-token'];

  if (!token || token !== VALID_ADMIN_TOKEN) {
    return res.status(401).json({
      ok: false,
      error: 'Yêu cầu quyền quản trị. Vui lòng nhập mã PIN hợp lệ.',
    });
  }

  next();
}
