import { PhotoIcon } from '@heroicons/react/24/outline'

export default function Skeleton() {
  return (
    <main className="print:bg-white print:min-h-0 md:p-4 md:pb-6 print:p-0">
      <div className="m-auto max-w-3xl p-4 md:p-8 print:p-0 md:rounded-md ring-gray-300 md:ring-2 print:ring-0 print:shadow-none shadow-lg bg-white">
        <div>
          <div className="animate-pulse">
            <header className="grid auto-rows-auto md:grid-cols-12 print:grid-cols-12 gap-4 mb-4">
              <div className="relative w-full md:col-span-3 print:col-span-3">
                <div className="flex items-center justify-center bg-gray-200 rounded-xl w-full aspect-square">
                  <PhotoIcon className="w-10 h-10 text-gray-200 dark:text-gray-500" />
                </div>
              </div>
              <div className="md:col-span-9 print:col-span-8">
                <div className="mb-4">
                  <div className="h-8 bg-gray-200 rounded-full w-3/4 mb-4" />
                  <div className="h-3.5 bg-gray-200 rounded-full w-1/6 mb-4" />
                </div>
                <div className="flex gap-4 flex-wrap">
                  <span className="h-6 bg-gray-200 rounded-full w-12 mb-4" />
                  <span className="h-6 bg-gray-200 rounded-full w-12 mb-4" />
                  <span className="h-6 bg-gray-200 rounded-full w-12 mb-4" />
                </div>
              </div>
            </header>
            <div className="pt-3 md:pt-0 md:grid grid-cols-8 gap-8 pb-8 sm:pb-4 md:pb-0">
              <div className="hidden md:block col-span-3">
                <div className="h-4 bg-gray-200 rounded-full w-5/6 mb-4" />
                <div className="h-4 bg-gray-200 rounded-full w-5/6 mb-4" />
                <div className="h-4 bg-gray-200 rounded-full w-2/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded-full w-5/6 mb-4" />
                <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-4" />
              </div>
              <div className="col-span-8 md:col-span-5 print:col-span-5 print:mt-2">
                <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2" />
                <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2" />
                <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2" />
                <div className="h-2.5 bg-gray-200 rounded-full w-2/3 mb-5" />
                <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2" />
                <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2" />
                <div className="h-2.5 bg-gray-200 rounded-full w-10/12 mb-2" />
                <div className="h-2.5 bg-gray-200 rounded-full w-1/2 mb-5" />
                <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2" />
                <div className="h-2.5 bg-gray-200 rounded-full w-5/6 mb-2" />
                <div className="h-2.5 bg-gray-200 rounded-full w-5/6 mb-2" />
                <div className="h-2.5 bg-gray-200 rounded-full w-2/3 mb-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}