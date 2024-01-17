'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ReactElement } from 'react'

type Props = {
  label: ReactElement
  items: ReactElement[]
}
export default function MenuDropdown({ label, items }: Props) {

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild className="py-6 px-4">
          {label}
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="bg-white z-20 shadow ml-4 border-b border-b-primary min-w-36" alignOffset={-16} sideOffset={-8} align="start">
            {items.map((item, i) => <DropdownMenu.Item key={i} asChild>{item}</DropdownMenu.Item>)}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  )
}
