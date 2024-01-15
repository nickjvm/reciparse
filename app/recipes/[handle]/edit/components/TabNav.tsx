'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import * as Tabs from '@radix-ui/react-tabs'

export default function TabNav({ recipe} ) {

  const tabs = [{
    value: 'general',
    label: 'Overview',
  }, {
    value: 'ingredients',
    label: 'Ingredients',
  }, {
    value: 'directions',
    label: 'Directions & Steps',
  }]
  return (
    <Tabs.Root className="TabsRoot" defaultValue={tabs[0].value}>
      <div className="grid grid-cols-4 gap-6 items-start">
        <Tabs.List aria-label="Edit recipe" className="col-span-1 flex flex-col rounded overflow-hidden mb-3">
          {tabs.map(tab => (
            <Tabs.Trigger key={tab.value} className={cn(
              'group text-left',
              'first:rounded-t-lg last:rounded-b-lg',
              'border border-slate-100',
              'radix-state-active:border-b-primary focus-visible:radix-state-active:border-b-transparent radix-state-inactive:bg-slate-100 dark:radix-state-active:border-b-gray-100 dark:radix-state-active:bg-gray-900 focus-visible:dark:radix-state-active:border-b-transparent dark:radix-state-inactive:bg-gray-800',
              'flex-1 px-3 py-2.5',
              'focus:radix-state-active:border-b-red',
              'focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75'
            )} value={tab.value}>
              {tab.label}
            </Tabs.Trigger>
          ))}

        </Tabs.List>
        <div className="col-span-3">
          <Tabs.Content value="general">
            <form className="space-y-6">
              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <label htmlFor="name">Recipe name</label>
                </div>
                <div className="col-span-3">
                  <Input type="text" value={recipe.name} className="w-full"/>
                </div>
              </div>
              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <label htmlFor="name">Collection</label>
                </div>
                <div className="col-span-3">
                  <select><option>-Select-</option></select>
                </div>
              </div>
              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <label htmlFor="name">Source URL</label>
                </div>
                <div className="col-span-3">
                  <Input type="text" value={recipe.name} className="w-full"/>
                </div>
              </div>
              <div className="grid grid-cols-4">
                <div className="col-span-3 col-start-2">
                  Public/private
                </div>
              </div>
              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <label htmlFor="name">Prep Time</label>
                </div>
                <div className="col-span-3">
                  <Input type="text" value={recipe.name} className="w-full"/>
                </div>
              </div>

              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <label htmlFor="name">Cook Time</label>
                </div>
                <div className="col-span-3">
                  <Input type="text" value={recipe.name} className="w-full"/>
                </div>
              </div>
              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <label htmlFor="name">Total Time</label>
                </div>
                <div className="col-span-3">
                  <Input type="text" value={recipe.name} className="w-full"/>
                </div>
              </div>
              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <label htmlFor="name">Recipe Yield</label>
                </div>
                <div className="col-span-3">
                  <Input type="text" value={recipe.name} className="w-full"/>
                </div>
              </div>
              <div className="text-center mt-3">
                <Button>Save</Button>
              </div>
            </form>
          </Tabs.Content>
          <Tabs.Content className="TabsContent" value="tab2">
          abc
          </Tabs.Content>
        </div>
      </div>
    </Tabs.Root>
  )
}