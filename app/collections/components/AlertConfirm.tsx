'use client'

import { Button } from '@/components/ui/button'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

type Props = {
  title: React.JSX.Element|string;
  description: React.JSX.Element|string;
  onConfirm: () => void;
  variant?: 'default'|'destructive'|'outline'|'secondary'
  trigger?: React.JSX.Element;
  action: string
}

export default function AlertConfirm({ title, description, onConfirm, trigger, variant = 'default', action }: Props) {
  return (
    <AlertDialog.Root>
      {trigger && <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>}
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed bg-slate-900/70 w-full h-full top-0 left-0 z-20" />
        <div className="p-4 fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center">
          <AlertDialog.Content className="w-[95vw] max-w-xl rounded-lg p-4 md:w-full max-h-full overflow-aut bg-white dark:bg-gray-800">
            <AlertDialog.Title className="font-display text-primary text-2xl font-semibold mb-3">{title}</AlertDialog.Title>
            <AlertDialog.Description className="text-md">
              {description}
            </AlertDialog.Description>
            <div className="flex justify-end align-center mt-4 space-x-3">
              <AlertDialog.Cancel asChild>
                <Button variant="link" className="text-slate-800">Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button variant={variant} onClick={onConfirm}>{action}</Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}