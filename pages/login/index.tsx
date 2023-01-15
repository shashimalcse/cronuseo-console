import { useState } from "react"
import User from "../user/[u_id]"

export default function Login() {

  const [user, setUser] = useState({username: "", password: ""})

  return (
    <div className='flex justify-center items-center w-screen h-screen'>
      <div className="w-full h-full  blur-2xl"></div>
      <div className='absolute flex flex-col justify-center items-center gap-10 w-full'>
        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-gray-400 to-black">
          cronuseo
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <div>
            <input value={user.username} onChange={(e)=> {setUser({username: e.target.value, password: user.password})}} type="text" id="username" className="block w-[300px] p-2 border border-yellow-500 rounded" placeholder='Username' />
          </div>
          <div>
            <input value={user.password} onChange={(e)=> {setUser({password: e.target.value, username: user.password})}} type="password" id="password" className="block w-[300px] p-2 border border-yellow-500 rounded" placeholder='Password' />
          </div>
          <button className='w-[130px] bg-black rounded-md px-5 py-2 text-white text-sm' onClick={()=>{console.log(user)}}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
