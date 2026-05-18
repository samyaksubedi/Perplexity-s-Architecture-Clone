import { envVariables } from '../Configs/env.config.js';
import { ApiError } from '../UTILS/API/error.api.js';
import jwt from 'jsonwebtoken';

const authenticateUser = async (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(new ApiError(401, 'No token provided'));
    }

    // 2. Extract token
    const token = authHeader.split(' ')[1];

    // 3. Verify token
    const decoded = jwt.verify(token, envVariables.ACCESS_TOKEN_SECRET);

    // 4. Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    // 5. Continue
    next();
  } catch (error) {
    // console.error(error.message);
    return res.status(401).json(new ApiError(401, 'Invalid or expired token'));
  }
};

export { authenticateUser };
