import jwt from 'jsonwebtoken';
import { ApiError } from '../UTILS/API/error.api.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            'Unauthorized - No token provided',
            [],
            'No token provided. Please login to access this resource.',
          ),
        );
    }
    // Un-signing JWT token ;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            'Unauthorized - Invalid token',
            [],
            'The provided token is invalid. Please login again.',
          ),
        );
    }

    const user = await User.findById(decoded.userId).select(
      '-password -emailVerificationToken -emailVerificationTokenExpires -resetPasswordToken -resetPasswordExpires',
    );
    if (!user) {
      return res
        .status(404)
        .json(
          new ApiError(
            404,
            'User Not Found',
            [],
            'No user found with the provided token.',
          ),
        );
    }
    req.user = user;
    console.log('Authenticated User:', user);

    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          'Internal Server Error - Authentication Failed',
          [],
          'An error occurred while authenticating the user.',
        ),
      );
  }
};
