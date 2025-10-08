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


export const validateRequest = (schema) => async (req, res, next) => {
  try {
    const validatedData = await schema.validate(req.body, {
      abortEarly: false, 
      stripUnknown: true, 
    });

    req.validatedData = validatedData;
    next();
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
      err.message = err.errors.join(', '); 
    }
    next(err);
  }
};
