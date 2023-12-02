import { HowToSection } from '@/types'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Control, FieldErrors, UseFormRegister, UseFormSetFocus, useFieldArray } from 'react-hook-form'
import { FormValues } from './types'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import RecipeInstructionStep from './recipeInstructionStep'
import classNames from 'classnames'

type Props = {
  control: Control<FormValues>
  instructions: HowToSection[],
  setFocus: UseFormSetFocus<FormValues>,
  register: UseFormRegister<FormValues>,
  errors: FieldErrors<FormValues>
}

export default function RecipeInstructions({ control, instructions, setFocus, register, errors }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    rules: {
      minLength: {
        message: 'Enter details for at least one step',
        value: 1,
      }
    },
    name: 'recipeInstructions',
  })

  const addSection = (name = '') => {
    append({
      '@type': 'HowToSection',
      name,
      itemListElement: [{
        '@type': 'HowToStep',
        text: ''
      }]
    })

    setTimeout(() => {
      setFocus(`recipeInstructions.${instructions.length}.name`)
    }, 250)
  }

  return (
    <>
      <ol>
        {fields.map((field, i) => (
          <li key={field.id} className={classNames('mb-2 rounded-md', i > 0 && 'mt-4 pt-4 border-t border-t-gray-300')}>
            <span className="grid grid-cols-12 gap-2 flex-grow col-span-11 items-start">
              <div className="col-span-10 col-start-2">
                <Input label="Section Title" type="text" {...register(`recipeInstructions.${i}.name`, { required: 'Required'})} />
              </div>
              {fields.length > 1 && (
                <button type="button" className="mt-3" onClick={() => remove(i)}>
                  <MinusIcon className="w-5" />
                </button>
              )}
            </span>
            <RecipeInstructionStep steps={fields[i].itemListElement} register={register} control={control} setFocus={setFocus} errors={errors} sectionIndex={i} />
          </li>
        ))}
      </ol>
      {/* <FormError message={errors.recipeInstructions?.root?.message} /> */}
      {instructions[instructions.length - 1]?.name && (
        <div className="grid grid-cols-12">
          <Button type="button" block appearance="secondary" icon={<PlusIcon className="w-5" />} onClick={() => addSection('')} className="col-span-11">
                Add section
          </Button>
        </div>
      )}
    </>
  )
}