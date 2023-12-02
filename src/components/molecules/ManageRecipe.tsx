import { Popover } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import request from '@/lib/api'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { PencilIcon, TrashIcon, LockOpenIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import { CustomRecipe } from '@/types'
import { useEffect, useState } from 'react'

type Props = {
  handle: string
  recipe: CustomRecipe
}
export default function ManageRecipe({
  recipe,
}: Props) {
  const [isPublic, setPublic] = useState<boolean>(recipe.public)
  const router = useRouter()

  useEffect(() => {
    setPublic(recipe?.public ?? false)
  }, [recipe?.public])
  const onDelete = async () => {
    await request('/api/recipes/custom/' + recipe.handle, {
      method: 'DELETE',
    })

    router.push('/recipes')
  }

  const togglePublic = async () => {
    console.log('here')
    try {
      const { data } = await request('/api/recipes/custom/' + recipe.handle + '/' + (isPublic ? 'private' : 'public'), {
        method: 'POST',
      })
      setPublic(data.public)
    } catch (e) {
      console.log(e)
    }
  }

  if (!recipe) {
    return
  }
  return (
    <Popover className="relative mb-2">
      {({ open }) => (
        <>
          <Popover.Button className={classNames(
            'relative transition bg-white flex items-center text-sm leading-6 text-gray-900  hover:border-slate-200 border focus-visible:outline-0 py-1.5 px-2',
            open && 'border-slate-200 rounded-t z-10 border-b-white hover:border-b-white',
            !open && 'rounded'
          )}>
            Manage
            <ChevronDownIcon className="w-4 stroke-gray-500 ml-3"/>
          </Popover.Button>

          <Popover.Panel className="overflow-hidden border-slate-200 border z-0 mt-[-1px] transition text-sm leading-6 shadow absolute bg-white right-0  rounded-b rounded-tl w-40 min-w-fit whitespace-nowrap">
            <Link href={`/recipes/edit/${recipe.handle}`} className="flex items-center hover:bg-slate-50 px-3 py-2">
              <PencilIcon className="w-5 inline-block mr-2" />
              Edit
            </Link>
            <button type="button" className="flex items-center w-full text-left hover:bg-slate-50 px-3 py-2" onClick={onDelete}>
              <TrashIcon className="w-5 inline-block mr-2" />
               Delete
            </button>
            <button type="button" onClick={togglePublic} className="w-full transition flex items-center text-left hover:bg-slate-50 px-3 py-2">
              {!isPublic ? (
                <>
                  <LockClosedIcon className="w-5 inline-block mr-2"/>
                    Make Public
                </>
              ) : (
                <>
                  <LockOpenIcon className="w-5 inline-block mr-2"/>
                  Make Private
                </>
              )}
            </button>
          </Popover.Panel>
        </>
      )}
    </Popover>
  )
}