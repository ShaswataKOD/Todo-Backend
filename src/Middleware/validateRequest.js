import { createTasksSchema,updateTasksSchema } from "./taksValidationSchema.js"

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

// this is to be imported in the server to use as middleware
export const todoCreateSchema = validateRequest(createTasksSchema) 
export const todoUpdateSchema = validateRequest(updateTasksSchema) 