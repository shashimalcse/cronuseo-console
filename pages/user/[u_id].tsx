import { faPlus, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import Create_Model from '../../components/create_model';
import { fetcher } from '../../src/fetcher';
import { IActionCreateRequest, IActionsReslut, IResourcesReslut, IResourcesResponse, IUsersReslut } from '../../src/interfaces';
import { routes } from '../../src/routes';
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export default function User() {
    const router = useRouter()
    const { u_id } = router.query
    const [user, setUser] = useState<IUsersReslut | undefined>(undefined)
    const [showRoles, setShowRoles] = useState(false)
    const [name, setName] = useState("")
    const [showModal, setShowModel] = useState(false)
    const [roles, setRoles] = useState<IActionsReslut[] | undefined>(undefined)

    useEffect(() => {
        fetch(routes.user + `/${u_id}`)
            .then((res) => res.json())
            .then((data) => {
                setUser(data)
                setName(data.name)
            })
    }, [])

    useEffect(() => {
        if (showRoles) {
            fetch(`http://localhost:8080/api/v1/${u_id}/role`)
                .then((res) => res.json())
                .then((data) => {
                    setActions(data?.results)
                })
        }
    })

    const submitAction = async () => {
        console.log(action)
        const response = await fetch(`http://localhost:8080/api/v1/${r_id}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json ; charset=utf8' },
            body: JSON.stringify(action)
        })
        if (response.status == 201) {
            setAction({ name: "", action_key: "" })
            setShowModel(false)
        }

    }

    const deleteAction = async (action_id: string) => {
        const response = await fetch(`http://localhost:8080/api/v1/${r_id}/action/${action_id}`, {
            method: 'DELETE',
        })
    }

    return (
        <div className=''>
            <div className='flex flex-col'>
                <div className='flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4'>
                    <div className='flex flex-row justify-between items-center gap-5'>
                        <Link href={"/resource"}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </Link>
                        <h1 className='font-sans text-xl font-bold'>{resource?.name}</h1>
                        <div className='text-gray-500 text-sm'>{resource?.resource_key}</div>
                    </div>
                    {showCreateAction ? <button className='bg-black rounded-md px-4 py-2 text-white font-semibold' onClick={() => setShowModel(true)}>
                        <div className='flex flex-row justify-between items-center gap-2'>
                            <FontAwesomeIcon icon={faPlus} />
                            Create a Action
                        </div>
                    </button> : null}
                </div>
                <div className='flex flex-col mx-10 border rounded-lg bg-white'>
                    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-200">
                        <ul className="flex flex-wrap -mb-px">
                            <li className="mr-2" onClick={() => { setShowCreateAction(false) }}>
                                <a href="#" className={(!showCreateAction ? "text-yellow-400 border-yellow-400" : "hover:text-gray-600 hover:border-gray-300") + " inline-block p-4 rounded-t-lg border-b-2 border-transparent"}>Settings</a>
                            </li>
                            <li className="mr-2" onClick={() => { setShowCreateAction(true) }}>
                                <a href="#" className={(showCreateAction ? "text-yellow-400 border-yellow-400" : "hover:text-gray-600 hover:border-gray-300") + " inline-block p-4 rounded-t-lg border-b-2 border-transparent"}>Actions</a>
                            </li>
                        </ul>
                    </div>
                    <div className='flex'>
                        {
                            !showCreateAction ?
                                <div className='flex flex-col flex-grow justify-between m-5'>
                                    <div>
                                        <label className="block mb-2 text-xs font-medium">Resource Name</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} id="name" className="block w-[300px] p-2 border rounded-lg sm:text-xs hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500" placeholder='Resource Name' required />
                                    </div>
                                    <div className='flex flex-grow flex-row justify-end items-center'>
                                        <button className='bg-black rounded-md px-6 py-2 text-white text-xs'>
                                            Save Changes
                                        </button>
                                    </div>
                                </div> :
                                <div className='flex flex-col flex-grow justify-between m-5'>
                                    <div className="flex flex-col">
                                        <div className="overflow-x-auto">
                                            <div className="w-full inline-block align-middle">
                                                <div className='overflow-hidden border rounded-lg'>
                                                    <table className='min-w-full divide-y divide-gray-200'>
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                                                    <a className="">
                                                                        Action Name
                                                                    </a>
                                                                </th>
                                                                <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                                                    <a className="">
                                                                        Action Key
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
                                                                actions?.map((action: IActionsReslut) => {
                                                                    return (
                                                                        <tr key={action.action_key}>
                                                                            <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                                                {action.name}
                                                                            </td>
                                                                            <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                                                {action.action_key}
                                                                            </td>
                                                                            <td className="px-10 py-2 text-right text-gray-800 whitespace-nowrap">
                                                                                <button onClick={() => { deleteAction(action.action_id) }}>
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
                                </div>
                        }
                    </div>
                </div>
                <Create_Model title='Create a Resource' isVisible={showModal} onClose={() => {
                    setAction({ name: "", action_key: "" })
                    setShowModel(false)
                }
                }>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Resource Name</label>
                        <input type="text" value={action.name} onChange={(e) => setAction({ name: e.target.value, action_key: action.action_key })} id="name" className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Resource Key</label>
                        <input type="text" value={action.action_key} onChange={(e) => setAction({ name: action.name, action_key: e.target.value })} id="key" className="block w-full p-2 text-gray-50 border border-gray-500 rounded-lg bg-gray-600 sm:text-xs focus:ring-yellow-500 focus:border-yellow-500" placeholder='Resource Name' />
                    </div>
                    <div className='flex flex-grow flex-row justify-end items-center'>
                        <button className='bg-yellow-500 rounded-md px-6 py-2 text-white text-xs' onClick={() => { submitAction() }}>
                            Create
                        </button>
                    </div>
                </Create_Model>
            </div>
        </div>
    )
}