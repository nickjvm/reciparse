import { parse } from 'iso8601-duration'
import { forwardRef, useId, useState } from 'react'
import { ControllerRenderProps } from 'react-hook-form'

type Props = {
  label: string
} & ControllerRenderProps

const parseFieldDuration = (value: string) => {
  try {
    return parse(value || 'PT0H0M')
  } catch (e) {
    return {
      minutes: 0,
      hours: 0,
    }
  }
}
const DurationInput = forwardRef<HTMLInputElement, Props>(
  ({ label, ...field }, ref) => {
    const [value, setValue] = useState(parseFieldDuration(field.value))
    const id = useId()
    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!e.target.value) {
        e.target.value = '0'
        const name = e.target.name.split('.')[1]
        setValue({
          ...value,
          [name]: 0
        })
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name.split('.')[1] as 'hours'|'minutes'

      const valueAsNumber = Number(e.target.value)
      const nextValue = {
        ...value,
        [name]: isNaN(valueAsNumber) ? value[name] : valueAsNumber
      }
      setValue(nextValue)
      field.onChange(`PT${nextValue.hours}H${nextValue.minutes}M`)
    }
    return (
      <div>
        <label htmlFor={`${id}.hours`} className="text-sm text-slate-600">{label}</label>
        <div className="bg-white flex items-center h-9 w-full rounded-md border border-input px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within::ring-ring disabled:cursor-not-allowed disabled:opacity-50">
          <input name={`${id}.hours`} id={`${id}.hours`}ref={ref} onChange={handleChange} onBlur={onBlur} value={value.hours} type="text" className="w-8 text-right focus:outline-none h-4 placeholder:text-black" />
          <label htmlFor={`${id}.hours`}>h</label>
          <input name={`${id}.minutes`} onChange={handleChange} onBlur={onBlur} value={value.minutes} type="text" className="w-8 text-right focus:outline-none h-4 placeholder:text-black" />
          <label htmlFor={`${id}.minutes`}>m</label>
        </div>
      </div>
    )
  })

DurationInput.displayName = 'DurationInput'

export default DurationInput