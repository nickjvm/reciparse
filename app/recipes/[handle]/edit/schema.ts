import * as z from 'zod'

const FormSchema = z
  .object({
    name: z.string(),
    collection_id: z.string({ invalid_type_error: 'Select a collection.' }).uuid(),
    source: z.string().optional(),
    prepTime: z.string().nullable().optional(),
    cookTime: z.string().nullable().optional(),
    totalTime: z.string().nullable().optional(),
    yield: z.number({ invalid_type_error: 'Enter a number.' }).min(1).optional(),
    is_public: z.boolean(),
    ingredients: z.string().min(1, { message: 'Required.' }).array(),
    instructions: z.object({
      name: z.string().min(1, { message: 'Required.'}),
      steps: z.object({
        name: z.string().optional(),
        text: z.string().min(1, { message: 'Required.'}),
      }).array(),
    }).array(),
    image: z.string().url().nullable().optional()
  })

export default FormSchema