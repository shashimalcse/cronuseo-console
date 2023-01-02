import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import Create_Model from '../../components/create_model';
import { IRolesReslut, IUsersReslut, IUserUpdateRequest } from '../../src/interfaces';
import { routes } from '../../src/routes';

export default function User() {
    const router = useRouter()
    const { u_id } = router.query
    const [user, setUser] = useState<IUsersReslut | undefined>(undefined)
    const [showRoles, setShowRoles] = useState(false)
    const [name, setName] = useState<IUserUpdateRequest>({ firstname: "", lastname: "" })
    const [roles, setRoles] = useState<IRolesReslut[] | undefined>(undefined)

    useEffect(() => {
        fetch(routes.user + `/${u_id}`)
            .then((res) => res.json())
            .then((data) => {
                setUser(data)
            })
    }, [])

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/ba85c765-aa3e-4a9c-9d40-10db2c6f6c51/role/${u_id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setRoles(data?.results)
            })
    }, [])

    return (
        <div className=''>
            <div className='flex flex-col'>
                <div className='flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4'>
                    <div className='flex flex-row justify-between items-center gap-5'>
                        <Link href={"/user"}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </Link>
                        <h1 className='font-sans text-xl font-bold'>{`${user?.firstname} ${user?.lastname}`}</h1>
                        <div className='text-gray-500 text-sm'>{user?.username}</div>
                    </div>
                </div>
                <div className='flex flex-col mx-10 border rounded-lg bg-white'>
                    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-200">
                        <ul className="flex flex-wrap -mb-px">
                            <li className="mr-2" onClick={() => { setShowRoles(false) }}>
                                <a href="#" className={(!showRoles ? "text-yellow-400 border-yellow-400" : "hover:text-gray-600 hover:border-gray-300") + " inline-block p-4 rounded-t-lg border-b-2 border-transparent"}>Settings</a>
                            </li>
                            <li className="mr-2" onClick={() => { setShowRoles(true) }}>
                                <a href="#" className={(showRoles ? "text-yellow-400 border-yellow-400" : "hover:text-gray-600 hover:border-gray-300") + " inline-block p-4 rounded-t-lg border-b-2 border-transparent"}>Roles</a>
                            </li>
                        </ul>
                    </div>
                    <div className='flex'>
                        {
                            !showRoles ?
                                <div className='flex flex-col flex-grow justify-between m-5 gap-2'>
                                    <div>
                                        <label className="block mb-2 text-xs font-medium">First Name</label>
                                        <input type="text" value={name.firstname} onChange={(e) => setName({ firstname: e.target.value, lastname: name.lastname })} id="firstname" className="block w-[300px] p-2 border rounded-lg sm:text-xs hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500" placeholder='First Name' required />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-xs font-medium">Last Name</label>
                                        <input type="text" value={name.lastname} onChange={(e) => setName({ lastname: e.target.value, firstname: name.firstname })} id="lastname" className="block w-[300px] p-2 border rounded-lg sm:text-xs hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500" placeholder='Last Name' required />
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
                                                                        Role Name
                                                                    </a>
                                                                </th>
                                                                <th className="px-10 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
                                                                    <a className="">
                                                                        Role Key
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
                                                                                {role.name}
                                                                            </td>
                                                                            <td className="px-10 py-2 text-left text-gray-800 whitespace-nowrap">
                                                                                {role.role_key}
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
                {/* <Create_Model title='Create a Resource' isVisible={showRoles} onClose={() => {
                    setAction({ name: "", action_key: "" })
                    showRoles(false)
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
                </Create_Model> */}
            </div>
        </div>
    )
}