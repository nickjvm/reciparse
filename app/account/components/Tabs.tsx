'use client'

import Heading from '@/components/ui/atoms/Heading'
import { cn } from '@/lib/utils'
import * as Tabs from '@radix-ui/react-tabs'
import { Session } from '@supabase/supabase-js'
import { useState } from 'react'
import AccountTab from './AccountTab'

const tabs = [{
  label: 'Sign In & Security',
  value: 'security',
}, {
  value: 'content',
  label: 'My Content',
}]

type Props = {
  session: Session
}
export default function AccountTabs({ session }: Props) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].value)

  return (
    <Tabs.Root className="TabsRoot" value={activeTab} onValueChange={setActiveTab}>
      <div className="grid grid-cols-4 gap-6 items-start">
        <Tabs.List aria-label="Edit recipe" className="-mx-4 md:mx-0 col-span-4 md:col-span-1 flex md:flex-col rounded overflow-hidden mb-3 whitespace-nowrap">
          {tabs.map(tab => (
            <Tabs.Trigger key={tab.value} className={cn(
              'group text-left md:shrink-0',
              'md:first:rounded-t-lg md:last:rounded-b-lg',
              'border border-slate-100',
              'w-[45%] md:w-full',
              'text-center md:text-left',
              'radix-state-active:border-b-primary focus-visible:radix-state-active:border-b-transparent radix-state-inactive:bg-slate-100 dark:radix-state-active:border-b-gray-100 dark:radix-state-active:bg-gray-900 focus-visible:dark:radix-state-active:border-b-transparent dark:radix-state-inactive:bg-gray-800',
              'flex-1 px-3 py-2.5',
              'focus:radix-state-active:border-b-red',
              'focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75'
            )} value={tab.value}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="col-span-4 md:col-span-3">
          <Tabs.Content value="security">
            <AccountTab session={session} />
          </Tabs.Content>
          <Tabs.Content value="content">
            <Heading>My Collections</Heading>
            <Heading>My Recipes</Heading>
          </Tabs.Content>
        </div>
      </div>
    </Tabs.Root>
  )
}