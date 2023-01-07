import { useState } from 'react'
import { routes } from '../../src/routes'

export default function Playground() {
    const [role, setRole] = useState("")
    const [action, setAction] = useState("")
    const [resource, setResource] = useState("")
    const [allowed, setAllowed] = useState<boolean | undefined>(undefined)


    const check = async () => {
        const tuple = {
            object: resource,
            relation: action,
            subject: role
        }
        await fetch(routes.permission + `/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json ; charset=utf8' },
            body: JSON.stringify(tuple)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setAllowed(data)
            }
            )
    }

    return (
        <div className='flex justify-center items-center'>
            <div className={`w-full h-[300px] mt-52 mx-16 rounded-full ${allowed == undefined ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 " : (allowed ? "bg-green-600" : "bg-red-600")} blur-3xl`}></div>
            <div className='absolute flex flex-col w-full mt-52'>
                <div className='flex flex-col'>
                    <div className='flex flex-row ml-5 justify-center'>
                        <div className='flex flex-col flex-grow z-10 items-center justify-center gap-10'>
                            <div className='flex flex-col flex-grow z-10 items-center justify-center gap-10'>
                                <div className='text-lg '>
                                    Role <span className='text-blue-500'>{role.length > 0 ? role : "[Role]"}</span> has the permissions to <span className='text-blue-500'>{action.length > 0 ? action : "[Action]"}</span> Resource <span className='text-blue-500'>{resource.length > 0 ? resource : "[Resource]"}</span> ?
                                </div>
                                <div className='text-3xl font-bold'>
                                    {`${allowed == undefined ? " " : (allowed ? "Allowed" : "Not Allowed")}`}
                                </div>
                            </div>
                            <div className={`flex flex-row gap-10 p-10`}>
                                <div>
                                    <input value={role} onChange={(e) => {
                                        setRole(e.target.value)
                                        setAllowed(undefined)
                                        }
                                        } type="text" id="key" className="w-[200px] h-[50px] block p-2 text-black text-center  rounded bg-gray-50 text-lg bg-opacity-40 placeholder-gray-700 focus:outline-none focus:border-white focus:ring-white" placeholder='Role' />
                                </div>
                                <div>
                                    <input value={action} onChange={(e) => {
                                        setAction(e.target.value)
                                        setAllowed(undefined)
                                        }
                                        } type="text" id="key" className="w-[200px] h-[50px] block p-2 text-black text-center  rounded bg-gray-50 text-lg bg-opacity-40 placeholder-gray-700 focus:outline-none focus:border-white focus:ring-white" placeholder='Action' />
                                </div>
                                <div>
                                    <input value={resource} onChange={(e) => {
                                        setResource(e.target.value)
                                        setAllowed(undefined)
                                        }
                                        } type="text" id="key" className="w-[200px] h-[50px] block p-2 text-black text-center  rounded bg-gray-50 text-lg bg-opacity-40 placeholder-gray-700 focus:outline-none focus:border-white focus:ring-white" placeholder='Resource' />
                                </div>
                            </div>
                            <div>
                                <button className='bg-blue-500 rounded w-[150px] px-6 py-2 text-white text-lg' onClick={() => check()}>
                                    Check
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}
