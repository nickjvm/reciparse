'use client;'
import { deleteCollection, updateCollection } from '@/app/collections/actions'
import DeleteCollection from '@/app/collections/components/DeleteCollection'
import EditCollection from '@/app/collections/components/EditCollection'
import { toast } from '@/components/ui/use-toast'
import { Collection } from '@/lib/types'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Props = {
  collections: Collection[]|null
}

export default function CollectionsTab({ collections }: Props) {
  const router = useRouter()
  if (!collections) {
    return
  }

  const handleEdit = async (values: { id: string, name: string }) => {
    const { error } = await updateCollection(values)

    toast({
      variant: error ? 'destructive' : 'default',
      title: error ? 'Something went wrong' : 'Collection updated',
      description: error ? error.message : ''
    })

    router.refresh()
  }

  return (
    <>

      <ul className="divide-y divide-slate-200 mb-4">
        {collections.map(collection => (
          <li key={collection.id} className="group flex justify-between items-center p-2">
            <Link className="space-x-2" href={`/recipes?collection=${collection.id}`}>
              <span>{collection.name}</span>
              <span className="text-sm text-slate-600">({collection.recipes?.[0]?.count} recipes)</span>
            </Link>
            <div className="space-x-3 opacity-0 group-hover:opacity-100 transition flex items-center leading-none">
              <DeleteCollection
                collection={collection}
                onConfirm={async () => await deleteCollection(collection.id)}
                trigger={<button className="hover:text-slate-800 text-slate-400"><TrashIcon className="w-4 h-4"/></button>}
              />
              <EditCollection
                collection={collection}
                onConfirm={handleEdit}
                trigger={<button className="hover:text-slate-800 text-slate-400"><PencilIcon className="w-4 h-4"/></button>}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}