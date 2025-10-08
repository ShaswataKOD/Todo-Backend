// export const validateRequest = async (schema, data, next) => {
//   try {
//     const validatedData = await schema.validate(data, {
//       abortEarly: false, 
//       stripUnknown: true, 
//     })
//     return validatedData
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       err.status = 400
//     }
//     next(err)
//   }
// }

// validation/validateRequest.js
export const validateRequest = (schema) => async (req, res, next) => {
  try {
    const validatedData = await schema.validate(req.body, {
      abortEarly: false, // return all errors
      stripUnknown: true, // remove unknown fields
    });

    req.validatedData = validatedData; // attach sanitized data to request
    next();
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
      err.message = err.errors.join(', '); // format all errors in one message
    }
    next(err);
  }
};
