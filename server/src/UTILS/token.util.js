import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { envVariables } from '../Configs/env.config.js';

const generateVerificationToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { token, expires };
};
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, // payload
    envVariables.ACCESS_TOKEN_SECRET, // secret key
    { expiresIn: '15m' }, // short expiry
  );
};
const generateRefreshToken = () => {
  const token = crypto.randomBytes(64).toString('hex');
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  return { token, expires };
};

export { generateVerificationToken, generateAccessToken, generateRefreshToken };
