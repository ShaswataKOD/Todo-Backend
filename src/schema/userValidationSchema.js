import * as yup from 'yup'

export const signUpSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
})

export const loginSchema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
})

export const resetPasswordSchema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: yup.string().required(),
})
