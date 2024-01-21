import { TriggerConfig, UseFormGetValues, UseFormTrigger } from 'react-hook-form'
import * as z from 'zod'

export const FormSchema = z
  .object({
    name: z.string().min(1, { message: 'Required.' }),
    collection_name: z.string().min(1, { message: 'Required' }).optional(),
    handle: z.string().min(10).optional().or(z.null()),
    collection_id: z.string({ invalid_type_error: 'Select a collection.' }).uuid().or(z.literal('-1')),
    source: z.string().optional().or(z.null()),
    prepTime: z.string().nullable().optional(),
    cookTime: z.string().nullable().optional(),
    totalTime: z.string().nullable().optional(),
    yield: z.number({ invalid_type_error: 'Enter a number.' }).min(1).optional(),
    is_public: z.boolean(),
    ingredients: z.string().min(1, { message: 'Required.' }).or(z.string().array().min(1, { message: 'Required' })),
    instructions: z.object({
      name: z.string().min(1, { message: 'Required.'}),
      steps: z.object({
        name: z.string().optional(),
        text: z.string().min(1, { message: 'Required.'}),
      }).array().min(1, { message: 'Required.' }),
    }).array().min(1, { message: 'Required.' }),
    image: z.string().url().nullable().optional(),
    upload: z.any()
      .refine((file) => {
        return file ? file?.size <= 5 * 1024 * 1024 : true
      }, 'Max file size is 5MB.')
      .refine(
        (file) => file ? ['image/jpeg', 'image/jpg', 'image/png'].includes(file?.type) : true,
        'only .jpg, .jpeg, .png and .gif files are accepted.'
      ).optional()
  }).superRefine((values, context) => {
    if (values.collection_id === '-1' && ! values.collection_name) {
      context.addIssue({
        message: 'Required.',
        code: z.ZodIssueCode.custom,
        path: ['collection_name'],
      })
    }
  })

export type Inputs = z.infer<typeof FormSchema>

export type FieldName = keyof Inputs

/** modified from https://github.com/react-hook-form/react-hook-form/issues/2379#issuecomment-757479521 */
export function getAllNamesByKey(values: Inputs, key: FieldName): FieldName[] {
  // Choose which parser we are using, as arrays use [ ] notation in useForm
  const parseArray = (stack: string, property: FieldName) => `${stack}[${property}]`
  const parseObj = (stack: string, property: FieldName) => `${stack}.${property}`
  // Recursively unpack the keys
  const unpackKeys = (obj: Inputs, stack: string, toReturn: FieldName[]) => {
    // Check which parser we will use
    const parser = Array.isArray(obj) ? parseArray: parseObj
    Object.entries(obj).forEach(([property, value]) => {
      const returnString = parser(stack, property as FieldName)
      // If its an object, recurse
      if (value && typeof value === 'object') {
        unpackKeys(value as unknown as Inputs, returnString, toReturn)
      } else {
        // This has a leading "." in it due to the start step in the
        // recursion.  Remove it using slice.
        toReturn.push(returnString.slice(1) as FieldName)
      }
    })

  }
  const toReturn: FieldName[] = []
  unpackKeys(values, '', toReturn)
  return toReturn.filter((fullKey) => fullKey.startsWith(key))
}

export function triggerByKeyGenerate(getValues: UseFormGetValues<Inputs>, trigger: UseFormTrigger<Inputs>, opts: TriggerConfig) {
  return async (key: FieldName) => {
    const values = getValues()
    const namesToTrigger = getAllNamesByKey(values, key)
    return await trigger(namesToTrigger, opts)
  }
}