import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Create_Model from '../../components/create_model'
import { useState, useEffect } from 'react'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { IResourceCreateRequest, IResourcesReslut } from '../../src/interfaces'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'

const Resource = ({ resourcesResult }: { resourcesResult: IResourcesReslut[] }) => {
    const [showModal, setShowModel] = useState(false)
    const [resources, setResources] = useState<IResourcesReslut[]>(resourcesResult)
    const [resource, setResource] = useState<IResourceCreateRequest>({ name: "", resource_key: "" })

    const router = useRouter()
    const { status, data } = useSession();


    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace('/auth/signin')
        }
    }, [status]);

    const submitResource = async () => {
        const response = await fetch(`${process.env.BASE_API}/${data?.user?.org_id}/resource`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${data?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
            body: JSON.stringify(resource)
        })
        if (response.status === 401) {
            router.push('/auth/signin')
        }
        if (response.status == 201) {
            setResource({ name: "", resource_key: "" })
            setShowModel(false)
        }
        fetchResources()

    }

    const deleteResource = async (resource_id: string) => {
        await fetch(`${process.env.BASE_API}/${data?.user?.org_id}/resource` + `/${resource_id}`, {
            headers: {
                Authorization: `Bearer ${data?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
            method: 'DELETE',
        })
            .then((res) => {
                if (res.status === 401) {
                    router.push('/auth/signin')
                }
            })
        fetchResources()
    }

    const fetchResources = async () => {

        await fetch(`${process.env.BASE_API}/${data?.user?.org_id}/resource`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data?.accessToken}`,
                    "Content-Type": "application/json ; charset=utf8",
                },
            })
            .then((res) => {
                if (res.status === 401) {
                    router.push('/auth/signin')
                }
                return res.json()
            })
            .then((data) => {
                setResources(data?.results)
            })
    }

    return (
        <div className='flex flex-col h-full'>
            <div className='flex-none w-[100hv] h-[50px] mx-8 my-4'>
                <div className='flex flex-row justify-between items-start'>
                    <div className='flex flex-col'>
                        <h1 className='font-sans text-xl font-bold'>Resources</h1>
                        <div className='text-gray-500 text-sm'>
                            Rresource are the target object you want to authorize access too.
                        </div>
                    </div>
                    <button className='bg-black rounded px-4 py-2 text-white font-semibold' onClick={() => setShowModel(true)}>
                        <div className='flex flex-row justify-between items-center gap-2'>
                            <FontAwesomeIcon icon={faPlus} />
                            Create a Resource
                        </div>
                    </button>
                </div>
            </div>
            <div className='flex-grow'>
                {(resources && resources.length > 0) ?
                    <div className="flex flex-col">
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

                                                            <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                                <Link href={"/resource/" + resource.resource_id}>
                                                                    {resource.name}
                                                                </Link>
                                                            </td>

                                                            <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                                {resource.resource_key}
                                                            </td>
                                                            <td className="px-10 py-2 text-right text-gray-800 whitespace-nowrap">
                                                                <button onClick={() => { deleteResource(resource.resource_id) }}>
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div> :
                    <div className='flex flex-col h-full justify-center items-center gap-5'>
                        <div className='text-gray-400 text-sm'>
                            There are no resource available at the moment.
                        </div>
                        <button className='bg-black rounded px-4 py-2 text-white font-semibold' onClick={() => setShowModel(true)}>
                            <div className='flex flex-row justify-between items-center gap-2'>
                                <FontAwesomeIcon icon={faPlus} />
                                Create a Resource
                            </div>
                        </button>
                    </div>
                }
            </div>
            <Create_Model title='Create a Resource' isVisible={showModal} onClose={() => {
                setResource({ name: "", resource_key: "" })
                setShowModel(false)
            }
            }>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Resource Name</label>
                    <input type="text" value={resource.name} onChange={(e) => setResource({ name: e.target.value, resource_key: resource.resource_key })} id="name" className="block w-full p-2 text-gray-50 border border-gray-500 rounded bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Resource Key</label>
                    <input type="text" value={resource.resource_key} onChange={(e) => setResource({ name: resource.name, resource_key: e.target.value })} id="key" className="block w-full p-2 text-gray-50 border border-gray-500 rounded bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                </div>
                <div className='flex flex-grow flex-row justify-end items-center'>
                    <button className='bg-yellow-500 rounded px-6 py-2 text-white text-xs' onClick={() => { submitResource() }}>
                        Create
                    </button>
                </div>
            </Create_Model>
        </div>
    )
}

export async function getServerSideProps({ req, res }: any) {

    const session = await getToken({ req: res.req })

    const response = await fetch(`${process.env.BASE_API}/${session?.org_id}/resource`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
        })

    if (response.status === 401) {
        return {
            redirect: {
                permanent: false,
                destination: '/auth/signin'
            }
        }
    }

    const resourcesResult = await response.json();
    return {
        props: {
            resourcesResult: resourcesResult.results,
        },
    };
}

export default Resource;
