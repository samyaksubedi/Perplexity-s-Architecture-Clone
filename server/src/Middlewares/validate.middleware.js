import { ApiError } from '../UTILS/API/error.api.js';

const validate = (schema) => {
  // takes a schema
  return async (req, res, next) => {
    // returns a middleware function
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(
        new ApiError(
          400,
          'Error validating the req body',
          result.error.issues.map((e) => {
            return { path: e.path, message: e.message };
          }),
          //   result.error.issues,
        ),
      );
    }

    req.body = result.data;
    next();
  };
};

export { validate };
