import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import Create_Model from '../../components/create_model';
import { fetcher } from '../../src/fetcher';
import { IResourcesReslut, IResourcesResponse } from '../../src/interfaces';
import { routes } from '../../src/routes';

export default function Resource() {
    const router = useRouter()
    const { r_id } = router.query
  
    const [resources, setResources]: any = useState<IResourcesReslut[] | undefined>(undefined)

    const { data, error } = useSWR<IResourcesResponse, Error>(
        routes.resource, fetcher);
    useEffect(() => {
        setResources(data?.results)
    })
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    return (
        <div className=''>
            <div className='flex flex-col'>
                <div className='flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4'>
                    <h1 className='font-sans text-xl font-bold'>Resources</h1>
                    <button className='bg-black rounded-md px-4 py-2 text-white font-semibold' onClick={() => setShowModel(true)}>
                        <div className='flex flex-row justify-between items-center gap-2'>
                            <FontAwesomeIcon icon={faPlus} />
                            Create a Resource
                        </div>
                    </button>
                </div>
                {/* <div className="flex flex-col">
                    <div className="overflow-x-auto">
                        <div className="p-5 w-full inline-block align-middle">
                            <div className='overflow-hidden border rounded-lg'>
                                <table className='min-w-full divide-y divide-gray-200'>
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                                <a className="">
                                                    Resource Name
                                                </a>
                                            </th>
                                            <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                                <a className="">
                                                    Resource Key
                                                </a>
                                            </th>
                                            <th className="px-10 py-3 text-xs font-bold text-right text-gray-500 uppercase ">
                                                <a className="">
                                                    Actions
                                                </a>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {
                                            resources?.map((resource: IResourcesReslut) => {
                                                return (

                                                    <tr key={resource.resource_key}>
                                                        <Link href={"/resource/" + resource.resource_id}>
                                                            <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                                {resource.name}
                                                            </td>
                                                        </Link>
                                                        <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                            {resource.resource_key}
                                                        </td>
                                                        <td className="px-10 py-2 text-right text-gray-800 whitespace-nowrap">
                                                            <button>
                                                                <FontAwesomeIcon icon={faEllipsisVertical} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* <Create_Model title='Create a Resource' isVisible={showModal} onClose={() => setShowModel(false)}>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Resource Name</label>
                        <input type="text" id="name" className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Resource Key</label>
                        <input type="text" id="key" className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                    </div>
                    <div className='flex flex-grow flex-row justify-end items-center'>
                        <button className='bg-yellow-500 rounded-md px-6 py-2 text-white text-xs' onClick={() => setShowModel(false)}>
                            Create
                        </button>
                    </div>
                </Create_Model> */}
            </div>
        </div>
    )
}

function useSWR<T, U>(resource: string, fetcher: (url: string) => Promise<any>): { data: any; error: any; } {
    throw new Error('Function not implemented.');
}


function setShowModel(arg0: boolean): void {
    throw new Error('Function not implemented.');
}
