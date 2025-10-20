import {
  signUpSchema,
  loginSchema,
  resetPasswordSchema,
} from './userValidationSchema.js'

export const validateSignUpRequest = async (req, res, next) => {
  try {
    if (req.headers.role === 'admin') {
      req.body.role = req.headers.role
    } else {
      req.body.role = 'user'
    };

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

export const validateResetPasswordRequest = async (req, res, next) => {
  try {
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
