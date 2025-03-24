import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])

const userRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('cashier'),
  z.literal('manager'),
])

const userSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  username: z.string().nullable(),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  status: userStatusSchema.nullable(),
  role: userRoleSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const userListSchema = z.array(userSchema)


// FORM
export const formSchema = z
  .object({
    firstName: z.string().min(1, { message: "First Name is required." }),
    lastName: z.string().min(1, { message: "Last Name is required." }),
    username: z.string().min(1, { message: "Username is required." }),
    phoneNumber: z.string().min(1, { message: "Phone number is required." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Email is invalid." }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, { message: "Role is required." }),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    // Handle required password for new users
    if (password === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required.",
        path: ["password"],
      });
      return;
    }

    if (password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters long.",
        path: ["password"],
      });
    }

    if (!password.match(/[a-z]/)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one lowercase letter.",
        path: ["password"],
      });
    }

    if (!password.match(/\d/)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least one number.",
        path: ["password"],
      });
    }

    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match.",
        path: ["confirmPassword"],
      });
    }
  });

// Create a separate schema for editing users
export const editFormSchema = z
  .object({
    firstName: z.string().min(1, { message: "First Name is required." }),
    lastName: z.string().min(1, { message: "Last Name is required." }),
    username: z.string().min(1, { message: "Username is required." }),
    phoneNumber: z.string().min(1, { message: "Phone number is required." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Email is invalid." }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, { message: "Role is required." }),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    // For edit mode, only validate password if one is provided
    if (password !== "") {
      if (password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters long.",
          path: ["password"],
        });
      }

      if (!password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one lowercase letter.",
          path: ["password"],
        });
      }

      if (!password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one number.",
          path: ["password"],
        });
      }

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match.",
          path: ["confirmPassword"],
        });
      }
    }
  });
