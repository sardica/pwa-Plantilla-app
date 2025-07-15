import { z } from 'zod'

export const cuadernoSchema = z.object({
  title: z.string({
    required_error: 'Title is required'
  }),
  content: z.string({
    required_error: 'Content is required'
  })
})
