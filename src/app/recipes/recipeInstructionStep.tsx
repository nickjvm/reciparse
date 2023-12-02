import Textarea from '@/components/atoms/Textarea'
import { HowToStep } from '@/types'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetFocus, useFieldArray } from 'react-hook-form'
import { FormValues } from './types'
import Button from '@/components/atoms/Button'
import { useEffect } from 'react'

type Props = {
  control: Control<FormValues>
  setFocus: UseFormSetFocus<FormValues>,
  errors: FieldErrors<FormValues>
  sectionIndex: number
  register: UseFormRegister<FormValues>,
  steps: HowToStep[]
}

export default function RecipeInstructionStep({ steps, control, setFocus, sectionIndex }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    rules: {
      minLength: {
        message: 'Enter details for at least one step',
        value: 1,
      }
    },
    name: `recipeInstructions.${sectionIndex}.itemListElement`,
  })

  const addStep = () => {
    append({
      '@type': 'HowToStep',
      text: ''
    })

    setTimeout(() => {
      setFocus(`recipeInstructions.${sectionIndex}.itemListElement.${fields.length}.text`)
    }, 250)
  }

  useEffect(() => {
    if (!fields?.length) {
      addStep()
    }
  }, [fields])

  console.log(fields[fields.length-1])
  return (
    <>
      <ol className="[counter-reset: step] col-span-12 mt-3">
        {fields.map((field, i) => (
          <li key={field.id} className="mb-2 before:text-brand-alt grid grid-cols-12 before:content-[counter(step)] before:font-bold before:text-xl print:before:text-right print:before:pr-3 [counter-increment:step]">
            <span className="grid grid-cols-12 gap-2 flex-grow col-span-11 items-start">
              <Controller rules={{ required: 'Required' }} name={`recipeInstructions.${sectionIndex}.itemListElement.${i}.text`} control={control} render={({ field }) => (
                <div className="col-span-11">
                  <Textarea placeholder={`Step ${i+1} details...`} className="resize-none w-full rounded-md border-gray-200 col-span-10" {...field} onKeyDown={(e) => {
                    if (e.code === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      addStep()
                    }
                  }} />
                </div>
              )} />
              {fields.length > 1 && (
                <button type="button" className="mt-3" onClick={() => remove(i)}>
                  <MinusIcon className="w-5" />
                </button>
              )}
            </span>
          </li>
        ))}
      </ol>
      {/* <FormError message={errors.recipeInstructions?.root?.message} /> */}
      {steps.length && steps[steps.length - 1]?.text && (
        <div className="grid grid-cols-12">
          <Button type="button" block appearance="secondary" icon={<PlusIcon className="w-5" />} onClick={addStep} className="col-span-6 col-start-2">
                Add step
          </Button>
        </div>
      )}
    </>
  )
}