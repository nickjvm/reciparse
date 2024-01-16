import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { TrashIcon } from '@radix-ui/react-icons'
import { UseFieldArrayAppend, UseFormReturn, useFieldArray } from 'react-hook-form'
import FormSchema from '../schema'

type Props = {
  sectionIndex: number;
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  addSection: UseFieldArrayAppend<z.infer<typeof FormSchema>, 'instructions'>|null;
}
export default function SectionSteps({
  sectionIndex,
  form,
  addSection
}: Props) {
  const { fields: steps, remove: removeStep, append: addStep } = useFieldArray({ control: form.control, name: `instructions.${sectionIndex}.steps`})
  return (
    <>
      <ol className="list-decimal ml-6 space-y-3">
        {steps.map((step, j) => {
          return (
            <li key={j}>
              <label htmlFor={`instructions.${sectionIndex}.steps.${j}.text`} className="sr-only">Section {sectionIndex + 1}, step {j + 1} details</label>
              <div className="relative group">
                <textarea key={j}
                  {...form.register(`instructions.${sectionIndex}.steps.${j}.text`)}
                  className="bg-white flex h-24 w-full rounded-md border border-input px-3 py-1 pr-14 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                {steps.length > 1 && <Button className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity group-hover:bg-slate-100" variant="ghost" onClick={() => removeStep(j)}><TrashIcon /></Button>}
              </div>
              <div className="text-red-800 mt-2 text-sm">{form.formState.errors.instructions?.[sectionIndex]?.steps?.[j]?.text?.message}</div>
            </li>
          )
        })}
      </ol>
      <div className="ml-6 space-x-3">
        <Button variant="outline" onClick={() => addStep({
          text: ''
        })}>Add step to section</Button>
        {addSection && (
          <Button onClick={() => {
            addSection({
              name: '',
              steps: [{
                text: ''
              }]
            })
          }}>Add new section</Button>
        )}
      </div>
    </>
  )
}