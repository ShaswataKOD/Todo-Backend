import {
  signUpSchema,
  loginSchema,
  resetPasswordSchema,
} from './userValidationSchema.js'


// Function to validate sign up request
export const validateSignUpRequest = async (req, res, next) => {
  try {
    if (req.headers.role === 'admin') {
      req.body.role = req.headers.role
    } else {
      req.body.role = 'user'
    }

    //
    // req.body.password = await bcrypt.hash(req.body.password,10);

    await signUpSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    console.log('Validated Sign Up:', req.body)
    next()
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = err.inner.map((e) => e.message)
      return res.status(400).json({ errors })
    }

    next(err)
  }
}

// Function to validate login request
export const validateLoginRequest = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    console.log('Validated Login:', req.body)
    next()
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = err.inner.map((e) => e.message)
      return res.status(400).json({ errors })
    }

    next(err)
  }
}

// Function to validate reset password request
export const validateResetPasswordRequest = async (req, res, next) => {
  try {
    // req.body.password = await bcrypt.hash(req.body.password, 10);

    await resetPasswordSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    console.log('Validated Reset Password:', req.body)

    next()
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = err.inner.map((e) => e.message)
      return res.status(400).json({ errors })
    }
    next(err)
  }
}
