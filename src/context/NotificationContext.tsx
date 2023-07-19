'use client'
import { createContext, useContext, useState, Fragment } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon, ExclamationCircleIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/solid'
interface NotificationContext {
  showNotification: (alert: Notification) => void
}

interface Notification {
  variant?: 'success'|'error'|'info'
  title: string
  message: string
  timeout?: number
}

const Context = createContext<NotificationContext>({} as NotificationContext)

export const useNotificationContext = () => useContext(Context)

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<Notification|null>(null)

  const showNotification = async (newAlert: Notification) => {
    setNotification(newAlert)

    if (newAlert?.timeout) {
      setTimeout(() => {
        setNotification(null)
      }, newAlert.timeout)
    }
  }

  return (
    <Context.Provider value={{ showNotification }}>
      {children}
      <>
        {/* Global notification live region, render this permanently at the end of the document */}
        <div
          aria-live="assertive"
          className="pointer-events-none fixed top-0 right-0 w-full inset-0 flex items-end px-4 py-4 sm:items-start sm:p-6 z-[10000]"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
            <Transition
              show={!!notification}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {notification?.variant === 'success' && <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />}
                      {notification?.variant === 'error' && <ExclamationCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />}
                      {!notification?.variant && <SparklesIcon className="h-6 w-6 text-brand-alt" aria-hidden="true" />}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="font-semibold">{notification?.title}</p>
                      <p className="mt-1 text-sm">{notification?.message}</p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                      <button
                        type="button"
                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setNotification(null)}
                      >
                        <XMarkIcon className="w-6" />
                        <span className="sr-only">Close notification</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </>
    </Context.Provider>
  )
}