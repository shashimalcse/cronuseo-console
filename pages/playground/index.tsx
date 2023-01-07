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
        <div className='flex flex-col'>
            <div className='flex flex-grow justify-between items-start w-[100hv] h-[50px] mx-8 my-4'>
                <h1 className='font-sans text-xl font-bold'>Playground</h1>
            </div>
            <div className='flex flex-row ml-5 justify-center'>
                <div className={`flex flex-grow flex-col h-[400px] bg-white rounded-2xl items-center justify-around mr-5`}>
                    <div className='text-lg'>
                        Role <span className='text-blue-500'>{role.length > 0 ? role : "[Role]"}</span> has the permissions to <span className='text-blue-500'>{action.length > 0 ? action : "[Action]"}</span> Resource <span className='text-blue-500'>{resource.length > 0 ? resource : "[Resource]"}</span> ?
                    </div>
                    <div className={`flex flex-row gap-10 p-10 ${allowed == undefined ? "bg-white ": (allowed? "bg-green-600": "bg-red-600")} bg-opacity-80 rounded-full backdrop-filter backdrop-grayscale backdrop-blur-md`}>
                        <div>
                            <input value={role} onChange={(e) => setRole(e.target.value)} type="text" id="key" className="w-[200px] h-[50px] block p-2 text-black border border-gray-300 rounded bg-gray-50 text-lg" placeholder='Role' />
                        </div>
                        <div>
                            <input value={action} onChange={(e) => setAction(e.target.value)} type="text" id="key" className="w-[200px] h-[50px] block p-2 text-black border border-gray-300 rounded bg-gray-50 text-lg" placeholder='Action' />
                        </div>
                        <div>
                            <input value={resource} onChange={(e) => setResource(e.target.value)} type="text" id="key" className="w-[200px] h-[50px] block p-2 text-black border border-gray-300 rounded bg-gray-50 text-lg" placeholder='Resource' />
                        </div>
                    </div>
                    <div>
                        <button className='bg-blue-500 rounded-md px-6 py-2 text-white text-lg' onClick={()=>check()}>
                            Check
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
