import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { RoleOption } from '.';
import Create_Model from '../../components/create_model';
import { IRolesReslut, IUserCreateRequest, IUsersReslut, IUserUpdateRequest } from '../../src/interfaces';
import { routes } from '../../src/routes';
import Select from 'react-select'

export default function User() {
    const router = useRouter()
    const { u_id } = router.query
    const [user, setUser] = useState<IUsersReslut>()
    const [showRoles, setShowRoles] = useState(false)
    const [updateUser, setUpdateUser] = useState<IUserUpdateRequest>({ firstname: "", lastname: "" , roles: []})
    const [roles, setRoles] = useState<IRolesReslut[]>([])
    const [assignedRoles, setassignedRoles] = useState<IRolesReslut[]>([])
    const [roleOptions, setRoleOptions] = useState<RoleOption[]>([])
    const [selectedOptions, setSelectedOptions] = useState<RoleOption[]>([])

    const submitUpdateUser = async () => {
        const role_ids = selectedOptions.map( role => {
            return {role_id : role.id}
        })
        updateUser.roles = role_ids
        console.log(updateUser)
        // const response = await fetch(routes.user, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json ; charset=utf8' },
        //     body: JSON.stringify(updateUser)
        // })
    }

    useEffect(() => {
        fetch(routes.user + `/${u_id}`)
            .then((res) => res.json())
            .then((data) => {
                setUser(data)
                setUpdateUser({firstname: user?.firstname, lastname: user?.lastname})
            })
    }, [])

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/ba85c765-aa3e-4a9c-9d40-10db2c6f6c51/role/${u_id}`)
            .then((res) => res.json())
            .then((data) => {
                setassignedRoles(data?.results)
            })
    }, [])

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/ba85c765-aa3e-4a9c-9d40-10db2c6f6c51/role`)
            .then((res) => res.json())
            .then((data) => {
                setRoles(data?.results)
            })
    }, [])

    useEffect(() => {
        if (roles.length > 0) {
            const options = roles.map(role => {
                return { label: role.name, value: role.role_key, id: role.role_id }
            })
            setRoleOptions(options)
            const assignedOptions = assignedRoles.map(role => {
                return { label: role.name, value: role.role_key, id: role.role_id }
            })
            setSelectedOptions(assignedOptions)
        }
    }, [roles])

    function handleSelect(data: any) {
        setSelectedOptions(data);
    }
    const customStyles = {
        option: (defaultStyles: any, state: any) => ({
            ...defaultStyles,
            fontSize: "12px",
        }),

        control: (defaultStyles: any) => ({
            ...defaultStyles,
            backgroundColor: "white",
            border: "solid #E4E4E7",
            fontSize: "12px",
            width: 500,


        }),
        singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
    };

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
                        </ul>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex flex-col justify-between m-5 gap-2 w-[500px]'>
                            <div>
                                <label className="block mb-2 text-xs font-medium">First Name</label>
                                <input type="text" value={updateUser.firstname} onChange={(e) => setUpdateUser({ firstname: e.target.value, lastname: updateUser.lastname })} id="firstname" className="block w-[500px] p-2 border rounded sm:text-xs hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500" placeholder='First Name' required />
                            </div>
                            <div>
                                <label className="block mb-2 text-xs font-medium">Last Name</label>
                                <input type="text" value={updateUser.lastname} onChange={(e) => setUpdateUser({ lastname: e.target.value, firstname: updateUser.firstname })} id="lastname" className="block w-[500px] p-2 border rounded sm:text-xs hover:border-yellow-500 focus:outline-none focus:border-yellow-500 focus:ring-yellow-500" placeholder='Last Name' required />
                            </div>
                            {roles.length > 0 ? <div>
                                <label className="block mb-2 text-xs font-medium text-gray-900">Roles for User</label>
                                <Select options={roleOptions} isMulti value={selectedOptions} onChange={handleSelect}
                                    styles={customStyles} />
                            </div> : null}
                        </div>
                        <div className='flex justify-end'>
                            <button className='bg-black rounded-md px-6 py-2 mb-5 mr-5 text-white text-xs' onClick={()=> submitUpdateUser()}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}