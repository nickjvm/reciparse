import { FormValues } from './addEditForm'

export const serializeRecipeForm = (values: FormValues) => {
  const formData = new FormData()
  for(const name in values) {
    const value = values[name as keyof FormValues]
    if (Array.isArray(value)) {
      value.forEach((s) => {
        const { text } = s as { text: string }
        formData.append(`${name}[]`, text || '')
      })
    } else if (name !== 'file' && typeof value === 'object') {
      formData.append(name, JSON.stringify(value))
    } else {
      formData.append(name, value as string)
    }
  }

  return formData
}