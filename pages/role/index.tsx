import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Create_Model from '../../components/create_model'
import { useState, useEffect } from 'react'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { IRoleCreateRequest, IRolesReslut } from '../../src/interfaces'
import { routes } from '../../src/routes';
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Role() {
    const [showModal, setShowModel] = useState(false)
    const [roles, setRoles] = useState<IRolesReslut[] | undefined>(undefined)
    const [role, setRole] = useState<IRoleCreateRequest>({ name: "", role_key: "" })

    const router = useRouter()
    const { status, data } = useSession();


    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace('/auth/signin')
        }
    }, [status]);

    const submitResource = async () => {
        const response = await fetch(`http://localhost:8080/api/v1/${data?.user?.org_id}/role`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${data?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
            body: JSON.stringify(role)
        })
        if (response.status == 201) {
            setRole({ name: "", role_key: "" })
            setShowModel(false)
        }
        fetchRoles()

    }

    const deleteResource = async (role_id: string) => {
        await fetch(`http://localhost:8080/api/v1/${data?.user?.org_id}/role` + `/${role_id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${data?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
        })
        fetchRoles()
    }

    useEffect(() => {
        fetchRoles()

    }, [])

    const fetchRoles = async () => {
        fetch(`http://localhost:8080/api/v1/${data?.user?.org_id}/role`, {
            headers: {
                Authorization: `Bearer ${data?.accessToken}`,
                "Content-Type": "application/json ; charset=utf8",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setRoles(data?.results)
            })
    }


    if (!roles) return <div>loading...</div>
    return (
        <div className='flex flex-col'>
            <div className='flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4'>
                <h1 className='font-sans text-xl font-bold'>Roles</h1>
                <button className='bg-black rounded-md px-4 py-2 text-white font-semibold' onClick={() => setShowModel(true)}>
                    <div className='flex flex-row justify-between items-center gap-2'>
                        <FontAwesomeIcon icon={faPlus} />
                        Create a Role
                    </div>
                </button>
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="p-5 w-full inline-block align-middle">
                        <div className='overflow-hidden border rounded-lg'>
                            <table className='min-w-full divide-y divide-gray-200'>
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                            <a className="">
                                                Role Name
                                            </a>
                                        </th>
                                        <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                            <a className="">
                                                Role Key
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
                                        roles?.map((role: IRolesReslut) => {
                                            return (
                                                <tr key={role.role_key}>

                                                    <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                        <Link href={"/role/" + role.role_id}>
                                                            {role.name}
                                                        </Link>
                                                    </td>

                                                    <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                        {role.role_key}
                                                    </td>
                                                    <td className="px-10 py-2 text-right text-gray-800 whitespace-nowrap">
                                                        <button onClick={() => { deleteResource(role.role_id) }}>
                                                            <FontAwesomeIcon icon={faTrash} />
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
            </div>
            <Create_Model title='Create a Resource' isVisible={showModal} onClose={() => {
                setRole({ name: "", role_key: "" })
                setShowModel(false)
            }
            }>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role Name</label>
                    <input type="text" value={role.name} onChange={(e) => setRole({ name: e.target.value, role_key: role.role_key })} id="name" className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role Key</label>
                    <input type="text" value={role.role_key} onChange={(e) => setRole({ name: role.name, role_key: e.target.value })} id="key" className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                </div>
                <div className='flex flex-grow flex-row justify-end items-center'>
                    <button className='bg-yellow-500 rounded-md px-6 py-2 text-white text-xs' onClick={() => { submitResource() }}>
                        Create
                    </button>
                </div>
            </Create_Model>
        </div>
    )
}
