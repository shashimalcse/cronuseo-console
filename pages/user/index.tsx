import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Create_Model from '../../components/create_model'
import { useState, useEffect } from 'react'
import { Column, useTable } from 'react-table'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import useSWR, { Key, Fetcher } from 'swr'
import { IResourceCreateRequest, IResourcesReslut, IResourcesResponse, IUserCreateRequest, IUsersReslut } from '../../src/interfaces'
import { routes } from '../../src/routes';
import { fetcher } from '../../src/fetcher'
import Link from 'next/link'

export default function Users() {
    const [showModal, setShowModel] = useState(false)
    const [users, setUsers] = useState<IUsersReslut[] | undefined>(undefined)
    const [user, setUser] = useState<IUserCreateRequest>({ username: "", firstname: "", lastname: "" })

    const submitUser = async () => {
        const response = await fetch(routes.user, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json ; charset=utf8' },
            body: JSON.stringify(user)
        })
        if (response.status == 201) {
            setUser({ username: "", firstname: "", lastname: "" })
            setShowModel(false)
        }

    }

    const deleteUser = async (user_id: string) => {
        const response = await fetch(routes.user + `/${user_id}`, {
            method: 'DELETE',
        })
    }

    useEffect(() => {
        fetch(routes.user)
            .then((res) => res.json())
            .then((data) => {
                setUsers(data?.results)
            })

    })

    if (!users) return <div>loading...</div>
    return (
        <div className='flex flex-col'>
            <div className='flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4'>
                <h1 className='font-sans text-xl font-bold'>Users</h1>
                <button className='bg-black rounded-md px-4 py-2 text-white font-semibold' onClick={() => setShowModel(true)}>
                    <div className='flex flex-row justify-between items-center gap-2'>
                        <FontAwesomeIcon icon={faPlus} />
                        Create a User
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
                                                Username
                                            </a>
                                        </th>
                                        <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                            <a className="">
                                                First Name
                                            </a>
                                        </th>
                                        <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                            <a className="">
                                                Last Name
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
                                        users?.map((user: IUsersReslut) => {
                                            return (
                                                <tr key={user.username}>

                                                    <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                        <Link href={"/resource/" + user.user_id}>
                                                            {user.username}
                                                        </Link>
                                                    </td>

                                                    <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                        {user.firstname}
                                                    </td>
                                                    <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                        {user.lastname}
                                                    </td>
                                                    <td className="px-10 py-2 text-right text-gray-800 whitespace-nowrap">
                                                        <button onClick={() => { deleteUser(user.user_id) }}>
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
            <Create_Model title='Create a New User' isVisible={showModal} onClose={() => {
                setUser({ username: "", firstname: "", lastname: "" })
                setShowModel(false)
            }
            }>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input type="text" value={user.username} onChange={(e) => setUser({ username: e.target.value, firstname: user.firstname, lastname: user.lastname })} id="username" className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                    <input type="text" value={user.firstname} onChange={(e) => setUser({ firstname: e.target.value, username: user.username, lastname: user.lastname })} id="firstname" className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                    <input type="text" value={user.lastname} onChange={(e) => setUser({ lastname: e.target.value, username: user.username, firstname: user.firstname })} id="lastname" className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                </div>
                <div className='flex flex-grow flex-row justify-end items-center'>
                    <button className='bg-yellow-500 rounded-md px-6 py-2 text-white text-xs' onClick={() => { submitUser() }}>
                        Create
                    </button>
                </div>
            </Create_Model>
        </div>
    )
}
