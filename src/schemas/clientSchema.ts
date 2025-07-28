// src/schemas/clientSchema.ts
import { z } from 'zod'

export const clientSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .nonempty({ message: 'Name is required' })
    .min(2,    { message: 'Name must be at least 2 characters' }),
  email: z
    .string()
    .nonempty({ message: 'E-mail is required' })
    .email({ message: 'Invalid e-mail address' }),
  phone: z.coerce
    .number()
    // first catch “blank” → NaN
    .refine((v) => !isNaN(v), {
      message: 'Phone number is required',
    })
    // then enforce exactly 10 digits
    .refine((v) => /^\d{10}$/.test(String(v)), {
      message: 'Must be exactly 10 digits',
    }),
  createdAt:     z.string().default(() => new Date().toISOString().slice(0, 10)),
  status:        z.enum(['prospect', 'active', 'inactive']).default('prospect'),
  industry:      z.enum(['SaaS', 'Finance', 'Retail', 'Healthcare']),
  monthlySpend:  z.number().nonnegative(),
  lifetimeValue: z.number().nonnegative(),
})

export type ClientForm = z.infer<typeof clientSchema>
