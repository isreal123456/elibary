import jwt from 'jsonwebtoken';

export function generateToken(userId) {
  const secret = process.env.JWT_SECRET || 'elibary-dev-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ userId }, secret, { expiresIn });
}
